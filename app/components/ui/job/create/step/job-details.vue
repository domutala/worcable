<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { watchImmediate } from "@vueuse/core";
import {
  getJobShema,
  JobContractTypeEnum,
  JobNatureEnum,
} from "~~/server/services/job_schema";
import * as z from "zod";
import _ from "lodash";
import { CurrencyAvailaible } from "~~/server/interfaces";

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
        :label="$t(`job.items.${item}.label`)"
        :help="$t(`job.items.${item}.hint`)"
        :ui="{ help: 'px-5', error: 'px-5' }"
      >
        <ui-salary-selector
          v-if="item === 'salary'"
          v-model="state.salary"
          :force-currency="CurrencyAvailaible.EUR"
        />

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
          v-model="state[item]"
          class="w-full"
          color="neutral"
          size="xl"
          value-key="value"
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
        ></u-select>
      </UFormField>

      <button type="submit" class="size-0 p-0 opacity-0 absolute"></button>
    </u-form>
  </div>
</template>
