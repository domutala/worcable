<script setup lang="ts">
import { getJobShema } from "~~/server/services/job_schema";
import * as z from "zod";
import _ from "lodash";
import type { FormSubmitEvent } from "@nuxt/ui";
import type { Job } from "~~/server/database/schema";
import { updateApplyStatus } from "~/tools/apply";

const { singleApplyStatus: schema } = getJobShema(Use.i18n.t);
type Schema = z.output<typeof schema>;

const job = defineModel<Job>("job", { required: true });
const applyStatus = defineModel<z.output<typeof schema>>("applyStatus");

const open = defineModel<boolean>("open");
const submiting = ref(false);
const toast = useToast();

async function onSubmit() {
  submiting.value = true;

  let all = _.cloneDeep(job.value.applyStatus);
  const i = all.findIndex((a) => a.key === applyStatus.value?.key);
  all.splice(i, 1);

  try {
    const result = await updateApplyStatus(job.value, all);

    toast.add({
      description: Use.i18n.t("job.items.applyStatus.labels.success_remove"),
      color: "success",
      icon: "i-lucide-trash-2",
    });

    job.value = result;
    open.value = false;
  } catch (error) {
  } finally {
    submiting.value = false;
  }
}
</script>

<template>
  <u-modal v-model:open="open" :ui="{ content: 'max-w-xl' }">
    <slot />

    <template #content>
      <ui-apply-status-display
        v-slot="{ color, label, icon, bgColor, borderColor }"
        v-model:job="job"
        :status="applyStatus?.key"
      >
        <div class="flex items-center gap-2 px-5 py-4">
          <u-icon v-if="icon" :name="icon" class="size-6" />
          <div>
            {{ label }}
          </div>
        </div>

        <u-container class="py-10 max-w-2xl">
          <div class="mb-5">
            {{ $t("job.items.applyStatus.labels.text_remove") }}
          </div>

          <u-button
            :loading="submiting"
            icon="i-lucide-trash-2"
            class="cursor-pointer px-5 py-3 rounded-xl"
            color="error"
            size="xl"
            @click="onSubmit"
          >
            {{ $t("words.to_remove") }}
          </u-button>
        </u-container>
      </ui-apply-status-display>
    </template>
  </u-modal>
</template>
