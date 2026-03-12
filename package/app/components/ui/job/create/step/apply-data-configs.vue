<script setup lang="ts">
import { watchImmediate } from "@vueuse/core";
import type { FormSubmitEvent } from "@nuxt/ui";
import { getJobShema } from "~~/server/services/job_schema";
import * as z from "zod";
import _ from "lodash";

const i18n = useI18n();
const { applyDataConfigs } = getJobShema(i18n.t);
const schema = z.object({ applyDataConfigs });
type Schema = z.output<typeof schema>;

const state = defineModel<Partial<Schema>>({ required: true });

const form = useTemplateRef("form");
const emit = defineEmits<{
  (e: "submit", value: Schema): void;
  (e: "input", value: Partial<Schema>): void;
}>();

async function onSubmit(event: FormSubmitEvent<Schema>) {
  emit("submit", event.data);
}

function setKey(key: string, val: boolean) {
  state.value.applyDataConfigs ||= {};

  if (!val) _.unset(state.value.applyDataConfigs, key);
  else if (!_.has(state.value.applyDataConfigs, "key")) {
    state.value.applyDataConfigs[key] = "use";
  }
}

defineExpose({ form });
</script>

<template>
  <div class="flex-1 py-16 pt-20">
    <u-form
      ref="form"
      :schema
      :state
      @submit="onSubmit"
      @error="(e) => console.log(e)"
    >
      <u-container class="max-w-4xl">
        <div class="space-y-2.5">
          <div
            v-for="applyDataOptions in applyDataOptionsList.filter(
              (a) => !a.required,
            )"
            :key="applyDataOptions.key"
            class="border border-default flex items-center gap-2 rounded-min p-3 bg-default/50 h-14"
          >
            <u-switch
              :label="$t(`apply.items.${applyDataOptions.key}.labels.title`)"
              :default-value="
                state.applyDataConfigs &&
                !!state.applyDataConfigs[applyDataOptions.key]
              "
              :ui="{ label: 'cursor-pointer', base: 'cursor-pointer' }"
              @update:model-value="(v) => setKey(applyDataOptions.key, v)"
            />

            <div class="mx-auto"></div>

            <template
              v-if="
                state.applyDataConfigs &&
                state.applyDataConfigs[applyDataOptions.key]
              "
            >
              <u-dropdown-menu
                :content="{ align: 'end' }"
                :items="[
                  {
                    value: 'use',
                    label: $t(`apply.labels.use`),
                    onSelect: () => {
                      state.applyDataConfigs![applyDataOptions.key] = 'use';
                    },
                  },
                  {
                    value: 'require',
                    label: $t(`apply.labels.require`),
                    onSelect: () => {
                      state.applyDataConfigs![applyDataOptions.key] = 'require';
                    },
                  },
                ]"
              >
                <u-button size="md">
                  {{
                    $t(
                      `apply.labels.${state.applyDataConfigs[applyDataOptions.key]}`,
                    )
                  }}
                </u-button>
              </u-dropdown-menu>
            </template>
          </div>
        </div>
      </u-container>

      <button type="submit" class="size-0 p-0 opacity-0 absolute"></button>
    </u-form>
  </div>
</template>
