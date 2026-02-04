<script setup lang="ts">
import { watchImmediate } from "@vueuse/core";
import type { FormSubmitEvent } from "@nuxt/ui";
import { getJobShema } from "~~/server/database/schema";
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
  <div class="flex-1 flex flex-col items-center justify-center">
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
        :ui="{ help: 'px-5', error: 'px-5' }"
      >
        <u-textarea
          v-model="state.jobDescription"
          class="w-full"
          color="neutral"
          :ui="{
            base: 'rounded-2xl p-5 px-7',
          }"
          :rows="2"
          :placeholder="$t('job.items.jobDescription.label')"
          autoresize
        ></u-textarea>
      </UFormField>

      <UFormField
        name="skills"
        :help="$t('job.items.skills.hint')"
        :ui="{ help: 'px-5', error: 'px-5' }"
      >
        <UInputTags
          class="w-full"
          color="neutral"
          size="xl"
          :ui="{
            base: 'rounded-2xl p-5 px-7',
            item: 'px-3 py-2 rounded-2xl',
            itemText: 'mr-2',
            itemDelete: 'cursor-pointer',
            root: 'py-4',
          }"
          :placeholder="$t(`job.items.skills.label`)"
          v-model="state.skills"
        >
        </UInputTags>
      </UFormField>

      <button type="submit" class="size-0 p-0 opacity-0 absolute"></button>
    </u-form>
  </div>
</template>
