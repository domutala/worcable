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
  <div class="flex gap-2 flex-1 overflow-y-hidden overflow-x-auto pb-3">
    <ui-apply-kanban-grid :status="null" v-model:job="job" />

    <div ref="container" class="flex gap-3">
      <template v-for="status in job.applyStatus" :key="status.key">
        <ui-apply-kanban-grid v-model:status="status.key" v-model:job="job" />
      </template>
    </div>

    <div>
      <ui-job-apply-status-edit v-model:job="job">
        <u-button
          size="xl"
          class="py-4 px-4 flex-col cursor-pointer rounded-2xl"
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
</template>

<style lang="scss">
.kanban {
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--border-color-default);
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    border-left: 1px solid var(--border-color-default);
  }
}
</style>
