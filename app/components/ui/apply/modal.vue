<script lang="ts" setup>
import { watchImmediate } from "@vueuse/core";
import { useRouteQuery } from "@vueuse/router";
import type { Apply, Job } from "~~/server/database/schema";

const applyID = useRouteQuery("modal-apply-id");

const isOpen = ref(false);
const fetching = ref(false);

const job = ref<Job>();
const apply = ref<Apply>();

watchImmediate(
  () => applyID.value,
  () => {
    if (!applyID.value) return;

    isOpen.value = true;

    fetchDatas();
  },
);

async function fetchDatas() {
  if (!applyID.value) return;

  apply.value = undefined;
  fetching.value = true;

  try {
    const url = `/api/admin/apply/${applyID.value}`;
    apply.value = await $fetch(url);
    job.value = await $fetch(`/api/admin/job/${apply.value!.jobID}`);
  } catch (error) {
    OnFetchError(error);
  } finally {
    fetching.value = false;
  }
}
</script>

<template>
  <u-modal
    v-if="applyID"
    v-model:open="isOpen"
    :ui="{ content: 'max-w-250 rounded-2xl' }"
    @update:open="
      () => {
        applyID = undefined;
      }
    "
  >
    <template #content>
      <div v-if="fetching" class="py-40 flex items-center justify-center">
        <u-icon name="i-lucide-loader-circle" class="animate-spin size-10" />
      </div>
      <ui-apply-display
        v-else-if="job && apply"
        v-model:apply="apply"
        v-model:job="job"
      />
    </template>
  </u-modal>
</template>
