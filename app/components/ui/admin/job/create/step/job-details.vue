<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { watchImmediate } from "@vueuse/core";
import {
  getJobShema,
  JobContractTypeEnum,
  JobNatureEnum,
} from "~~/server/database/schema";
import {
  currenciesCodes,
  formatCurrency,
  getSalaryMultiple,
} from "~~/server/tools/currencies";

import * as z from "zod";
import _ from "lodash";

const i18n = useI18n();
const items = ["location", "jobNature", "contractType", "salary"] as [
  "location",
  "jobNature",
  "contractType",
  "salary",
];

const { location, jobNature, contractType, salary } = getJobShema(i18n.t);
const schema = z.object({ location, jobNature, contractType, salary });
type Schema = z.output<typeof schema>;

const { data } = defineProps<{ data: Record<string, any> }>();
const state = reactive<Partial<Schema>>(_.cloneDeep(data));

const salaryValue = ref<[number, number]>(
  state.salary ? [state.salary.min, state.salary.max] : [45, 55],
);
const salaryCurrency = ref(state.salary?.currency || "XOF");

watchImmediate(() => salaryValue.value, setSalary, { deep: true });
watchImmediate(() => salaryCurrency.value, setSalary, { deep: true });
function setSalary() {
  if (!salaryValue) state.salary = undefined;
  else {
    state.salary = {
      min: salaryValue.value[0],
      max: salaryValue.value[1],
      currency: salaryCurrency.value,
    };
  }
}

const form = useTemplateRef("form");
const emit = defineEmits<{
  (e: "submit", value: Schema): void;
  (e: "input", value: Partial<Schema>): void;
}>();

async function onSubmit(event: FormSubmitEvent<Schema>) {
  emit("submit", event.data);
}

watchImmediate(
  () => state,
  () => emit("input", state),
  { deep: true },
);

defineExpose({ form });
</script>

<template>
  <div class="flex-1 flex flex-col items-center justify-center">
    <u-form
      ref="form"
      :schema="schema"
      :state="state"
      @submit="onSubmit"
      class="space-y-5 w-200 max-w-[90%] relative"
    >
      <UFormField
        v-for="item in items"
        :key="item"
        :name="item"
        :help="$t(`job.items.${item}.hint`)"
        :ui="{ help: 'px-5', error: 'px-5' }"
      >
        <div v-if="item === 'salary'" class="flex gap-2">
          <div
            class="rounded-2xl bg-default border border-default h-16 w-full flex items-center px-5 gap-3"
          >
            {{
              formatCurrency(
                salaryValue[0] * getSalaryMultiple(salaryCurrency),
                salaryCurrency,
                { locale: $i18n.locale },
              )
            }}
            <USlider
              v-model="salaryValue"
              color="neutral"
              :min="0"
              :max="100"
              :interval="getSalaryMultiple(salaryCurrency)"
              @update:model-value="(v) => {}"
            />
            {{
              formatCurrency(
                salaryValue[1] * getSalaryMultiple(salaryCurrency),
                salaryCurrency,
                { locale: $i18n.locale },
              )
            }}
          </div>

          <u-select
            class="w-50"
            color="neutral"
            size="xl"
            :ui="{ base: 'rounded-2xl p-5 px-7' }"
            :items="currenciesCodes"
            v-model="salaryCurrency"
          ></u-select>
        </div>

        <u-input
          v-else-if="item === 'location'"
          class="w-full"
          color="neutral"
          size="xl"
          :ui="{ base: 'rounded-2xl p-5 px-7' }"
          :placeholder="$t(`job.items.${item}.label`)"
          v-model="state[item]"
        ></u-input>

        <u-select
          v-else
          class="w-full"
          color="neutral"
          size="xl"
          :items="
            Object.keys(
              item === 'contractType' ? JobContractTypeEnum : JobNatureEnum,
            ).map((key) => ({
              value: key,
              label: $t(`job.items.${item}.types.${key}`),
            }))
          "
          :ui="{ base: 'rounded-2xl p-5 px-7' }"
          :placeholder="$t(`job.items.${item}.label`)"
          v-model="state[item]"
        ></u-select>
      </UFormField>

      <button type="submit" class="size-0 p-0 opacity-0 absolute"></button>
    </u-form>
  </div>
</template>
