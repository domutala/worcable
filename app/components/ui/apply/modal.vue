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

  if (!apply.value) applyID.value = undefined;
}
</script>

<template>
  <ui-modal
    v-if="applyID"
    v-model:open="isOpen"
    :ui="{
      content: [fetching ? 'max-w-14' : 'max-w-360', 'rounded-2xl'],
    }"
    @update:open="
      () => {
        applyID = undefined;
      }
    "
  >
    <template #content>
      <div v-if="fetching" class="flex items-center justify-center py-2">
        <u-icon name="i-lucide-loader-circle" class="animate-spin size-10" />
      </div>
      <ui-layout-inset v-else-if="job && apply" class="flex-1">
        <template #header>
          <div
            class="flex items-center gap-2 px-5 pt-3 pb-1 border-b-0 relative"
          >
            <UAvatar
              :src="Utils.getFileUrl(apply.data.avatar)"
              :alt="[apply.data.firstName, apply.data.lastName].join(' ')"
              class="border border-accented rounded-2xl text-md"
              size="3xl"
            />

            <div class="select-none leading-[1.1] flex-1 w-0">
              <div class="font-bold truncate">
                {{ apply.data.firstName }}
                {{ apply.data.lastName }}
              </div>

              <div class="truncate text-sm opacity-50">
                {{ Utils.getDateStatus(apply.createdAt) }}
              </div>
            </div>

            <div class="mx-auto w-10"></div>

            <ui-apply-options v-model:apply="apply" v-model:job="job" />
          </div>
        </template>

        <u-container class="py-10">
          <div class="flex gap-3 items-center mb-4 px-5">
            <ui-apply-note v-model:apply="apply" v-model:job="job" readonly />

            <ui-apply-status-button
              v-slot="{ color, label, icon, borderColor, bgColor }"
              v-model:apply="apply"
              v-model:job="job"
              readonly
            >
              <div class="flex items-center gap-2 leading-none">
                <u-icon :name="icon" />
                {{ label }}
              </div>
            </ui-apply-status-button>
          </div>

          <div class="grid grid-cols-12 gap-3">
            <div class="lg:col-span-8 col-span-12">
              <ui-apply-comment v-model:job="job" v-model:apply="apply" />
            </div>

            <div class="hidden lg:block col-span-4 scroller">
              <ui-apply-details v-model:apply="apply" v-model:job="job" />
            </div>
          </div>
        </u-container>
      </ui-layout-inset>
    </template>
    <!-- <template #content>
      <div v-if="fetching" class="py-40 flex items-center justify-center">
        <u-icon name="i-lucide-loader-circle" class="animate-spin size-10" />
      </div>
      <ui-apply-display
        v-else-if="job && apply"
        v-model:apply="apply"
        v-model:job="job"
      />
    </template> -->
  </ui-modal>
</template>
