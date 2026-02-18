<script setup lang="ts">
import { watchImmediate } from "@vueuse/core";
import type { FormSubmitEvent } from "@nuxt/ui";
import { getJobShema } from "~~/server/services/job_schema";
import * as z from "zod";
import _ from "lodash";

const i18n = useI18n();
const { jobDescription, skills } = getJobShema(i18n.t);
const schema = z.object({ jobDescription, skills });
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
  <div class="flex-1 flex flex-col items-center justify-center border-default">
    <u-form
      ref="form"
      :schema="schema"
      :state="state"
      @submit="onSubmit"
      class="space-y-5 w-200 max-w-[90%] relative"
    >
      <UFormField
        name="jobDescription"
        :help="$t('job.items.jobDescription.hint')"
      >
        <ui-editor
          v-model="state.jobDescription"
          :placeholder="$t('job.items.jobDescription.label')"
          :ui="{ editor: 'max-h-80' }"
          class="bg-default"
        />
      </UFormField>

      <UFormField name="skills" :help="$t('job.items.skills.hint')">
        <UInputTags
          class="w-full"
          color="neutral"
          :ui="{ base: 'bg-default' }"
          :placeholder="$t(`job.items.skills.label`)"
          v-model="state.skills"
        >
        </UInputTags>
      </UFormField>

      <button type="submit" class="size-0 p-0 opacity-0 absolute"></button>
    </u-form>
  </div>
</template>
