<script setup lang="ts">
import _ from "lodash";

const { applyStatusKey, jobId: jobID } = defineProps<{
  applyStatusKey: string;
  jobId: string;
}>();
const open = defineModel<boolean>("open");

const { job, applyStatus } = useJob(jobID);
const submiting = ref(false);
const toast = useToast();

async function onSubmit() {
  submiting.value = true;

  try {
    await applyStatus.value.remove(applyStatusKey);
    open.value = false;
  } catch (error) {
  } finally {
    submiting.value = false;
  }
}
</script>

<template>
  <ui-modal v-model:open="open" :ui="{ content: 'max-w-xl' }">
    <slot />

    <template #content>
      <ui-apply-status-display
        v-slot="{ label, icon }"
        v-model:job="job"
        :status="applyStatusKey"
      >
        <ui-layout-inset>
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

            <div class="flex items-center justify-end">
              <u-button
                :loading="submiting"
                icon="i-lucide-trash-2"
                class="cursor-pointer py-2 rounded-xl"
                color="error"
                variant="solid"
                @click="onSubmit"
              >
                {{ $t("words.to_remove") }}
              </u-button>
            </div>
          </u-container>
        </ui-layout-inset>
      </ui-apply-status-display>
    </template>
  </ui-modal>
</template>
