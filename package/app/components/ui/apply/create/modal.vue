<script lang="ts" setup>
import MarkdownIt from "markdown-it";
import { useRouteQuery } from "@vueuse/router";
import { watchImmediate } from "@vueuse/core";
import type { Job } from "~~/server/database/collections";

const jobID = useRouteQuery<string | undefined>(
  "modal-apply-create",
  undefined,
  { mode: "push" },
);

const md = new MarkdownIt();
const success = ref(false);
const loading = ref(false);
const isOpen = ref(true);
const job = ref<Job>();

watchImmediate(
  () => jobID.value,
  () => {
    if (!jobID.value) return;

    isOpen.value = true;
    success.value = false;

    fetchJob();
  },
);

async function fetchJob() {
  loading.value = true;

  try {
    job.value = await Api.$fetch<Job>(`/api/job/${jobID.value}`);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;

    if (!job.value) {
      isOpen.value = false;
      jobID.value = undefined;
    }
  }
}
</script>

<template>
  <ui-modal
    v-if="jobID"
    v-model:open="isOpen"
    :ui="{ content: [loading ? 'max-w-14' : 'max-w-360', 'rounded-2xl'] }"
    @update:open="$router.back"
  >
    <template #content>
      <div v-if="loading" class="flex items-center justify-center py-2">
        <u-icon name="i-lucide-loader-circle" class="animate-spin size-10" />
      </div>

      <ui-layout-inset v-else-if="job" class="flex-1">
        <template #header>
          <div class="py-4 px-5 flex gap-5 top-0 z-50 border-b-0">
            <div class="leading-none flex-1 min-w-0 w-0">
              <h1 class="text-lg font-bold truncate">
                {{ job.title }}
              </h1>
              <div class="truncate opacity-50">
                {{ job.location }}
              </div>
            </div>
          </div>
        </template>

        <u-container class="py-15">
          <div v-if="success" class="text-center py-15">
            <u-icon name="i-lucide-check-check" class="size-25 text-success" />
            <p
              v-html="md.render($t('apply.success'))"
              class="max-w-120 mx-auto mt-5"
            ></p>
          </div>
          <ui-apply-create v-else :job @success="success = true" />
        </u-container>
      </ui-layout-inset>
    </template>
  </ui-modal>
</template>
