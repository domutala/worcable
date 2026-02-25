<script lang="ts" setup>
import { type Apply, type Job } from "~~/server/database/schema";
import Sortable from "sortablejs";
import { updateApplyStatus } from "~/tools/apply";

const job = defineModel<Job>("job", { required: true });
const emit = defineEmits<(e: "update", apply: Apply) => void>();
const container = useTemplateRef("container");

onMounted(setSortable);
function setSortable() {
  if (!container.value) return;

  new Sortable(container.value, {
    scroll: true,
    handle: ".grid-handler",
    group: {
      name: "grid",
      pull: false,
      put: false,
    },
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
    onEnd(evt) {
      evt.item.removeAttribute("data-grid-dragging");

      if (evt.oldIndex !== evt.newIndex) {
        const newApplyStatus: any[] = [];

        evt.target.querySelectorAll("[data-grid]").forEach((item) => {
          const status = job.value.applyStatus.find(
            (st) => st.key === item.getAttribute("data-grid"),
          );

          if (status) newApplyStatus.push(status);
        });

        updateApplyStatus(job.value, newApplyStatus);
      }
    },
  });
}
</script>

<template>
  <!--  -->
  <div
    class="flex gap-2 flex-1 overflow-auto mb-10 mt-5 max-w-full w-450 mx-auto px-2 sm:px-5"
  >
    <ui-apply-kanban-grid :status="null" v-model:job="job" />

    <div ref="container" class="flex gap-2">
      <template v-for="status in job.applyStatus" :key="status.key">
        <ui-apply-kanban-grid v-model:status="status.key" v-model:job="job" />
      </template>

      <div>
        <ui-job-apply-status-edit v-model:job="job">
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
