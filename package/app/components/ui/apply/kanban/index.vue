<script lang="ts" setup>
import type { Apply, Job } from "~~/server/database/collections";
import { useSortable } from "@vueuse/integrations/useSortable";

const { jobId: jobID } = defineProps<{ jobId: string }>();
const { job } = useJob(jobID);
const applyStatus = ref(job.value.applyStatus);

const emit = defineEmits<(e: "update", apply: Apply) => void>();
const container = useTemplateRef("container");

const {} = useSortable(container, applyStatus, {
  handle: ".grid-handler",
  disabled: Store.session.user?.role !== "admin",
  group: { name: "grid", pull: false, put: false },
  scroll: true,
  dragClass: "dragging",
  chosenClass: "choose",

  onChoose(event) {
    event.item.setAttribute("data-grid-choosed", "");
  },
  onUnchoose(event) {
    event.item.removeAttribute("data-grid-choosed");
  },
  onMove(evt) {
    evt.dragged.setAttribute("data-grid-dragging", "");
  },

  async onEnd(evt) {
    evt.item.removeAttribute("data-grid-dragging");
    if (evt.oldIndex !== evt.newIndex) {
      try {
        const result = await Api.$fetch<Job>("/api/admin/job", {
          method: "post",
          body: { ...job.value, applyStatus: applyStatus.value },
        });

        job.value = result;
      } catch (error) {
        console.error(error);
      }
    }
  },
});
</script>

<template>
  <div
    v-if="job"
    class="flex gap-2 flex-1 overflow-auto mb-10 mt-5 max-w-full w-450 mx-auto px-2 sm:px-5"
  >
    <ui-apply-kanban-grid :status="null" :job-id="jobID" />

    <div ref="container" class="flex gap-2">
      <template v-for="status in applyStatus" :key="status.key">
        <ui-apply-kanban-grid v-model:status="status.key" :job-id="jobID" />
      </template>

      <div v-if="Store.session.user?.role === 'admin'">
        <ui-job-apply-status-edit :job-id="jobID">
          <u-button
            size="xl"
            class="py-4 px-5 flex-col cursor-pointer rounded ring ring-default"
            icon="i-lucide-plus"
            variant="outline"
            color="neutral"
          >
            <div style="writing-mode: sideways-rl">
              {{ $t("job.items.applyStatus.labels.new_btn") }}
            </div>
          </u-button>
        </ui-job-apply-status-edit>
      </div>
    </div>
  </div>
</template>
