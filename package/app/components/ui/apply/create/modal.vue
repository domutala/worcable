<script lang="ts" setup>
import { watchImmediate } from "@vueuse/core";
import type { Job } from "~~/server/database/collections";

const success = ref(false);
const loading = ref(false);
const job = ref<Job>();
const { uid, value: jobID } = useModal({ alias: "appy-for" });
const isAdmin = ref(false);

watchImmediate(
  () => jobID.value,
  () => {
    if (!jobID.value) return;

    isAdmin.value = !!jobID.value.split(":")[1];
    success.value = false;
    fetchJob();
  },
);

async function fetchJob() {
  if (!jobID.value) return;

  try {
    loading.value = true;
    job.value = await Api.$fetch<Job>(`/api/job/${jobID.value.split(":")[0]}`);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;

    if (!job.value) {
      jobID.value = undefined;
    }
  }
}
</script>

<template>
  <ui-modal-2
    v-if="jobID"
    :ui="{ content: [loading ? 'md:max-w-14' : 'max-w-360', 'rounded-2xl'] }"
    :uid
  >
    <template #content>
      <div v-if="loading" class="flex items-center justify-center py-2">
        <u-icon name="i-lucide-loader-circle" class="animate-spin size-10" />
      </div>

      <ui-layout-inset v-else-if="job" class="flex-1">
        <template #header>
          <div>
            <div
              class="h-12 px-5 flex items-center gap-5 top-0 z-50 border-b-0"
            >
              <div class="leading-none flex-1 min-w-0 w-0">
                <h1 class="text-lg font-bold truncate">
                  {{ job.title }}
                </h1>
                <!-- <div class="truncate opacity-50">
                {{ job.location }}
              </div> -->
              </div>
            </div>
          </div>
        </template>

        <u-container class="max-w-4xl">
          <div v-if="success" class="text-center py-15">
            <u-icon name="i-lucide-check-check" class="size-18 text-success" />
            <MDC
              :value="
                $t(
                  isAdmin
                    ? 'apply.create.success_admin'
                    : 'apply.create.success',
                )
              "
              unwrap="p"
            />
          </div>

          <ui-apply-create
            v-else
            :job
            :is-admin
            @success="success = true"
            class="pb-25 pt-10 md:pt-15 lg:pt-25"
          />
        </u-container>
      </ui-layout-inset>
    </template>
  </ui-modal-2>
</template>
