<script setup lang="ts">
import { watchImmediate } from "@vueuse/core";
import type { FormSubmitEvent } from "@nuxt/ui";
import { getJobShema } from "~~/server/services/job_schema";
import * as z from "zod";
import _ from "lodash";

const i18n = useI18n();
const { title } = getJobShema(i18n.t);
const schema = z.object({ title });
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
  () => state.title,
  () => {
    if (state.title) state.title = state.title.replaceAll("\n", "");
  },
);

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
      class="space-y-4 w-200 max-w-[90%] relative"
    >
      <UFormField
        name="title"
        class="m-0"
        :help="$t('job.items.title.hint')"
        :ui="{ help: 'px-5', error: 'px-5' }"
      >
        <u-textarea
          v-model="state.title"
          class="w-full"
          color="neutral"
          :ui="{
            base: 'bg-default text-4xl ',
          }"
          :rows="2"
          :placeholder="$t('job.items.title.label')"
          autoresize
        ></u-textarea>
      </UFormField>

      <button type="submit" class="size-0 p-0 opacity-0 absolute"></button>
    </u-form>
  </div>
</template>
