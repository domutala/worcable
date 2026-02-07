<script lang="ts" setup>
import {
  ApplyStatus,
  ApplyStatusColors,
  type Apply,
  type Job,
} from "~~/server/database/schema";
import _ from "lodash";
import Sortable from "sortablejs";

const { job } = defineProps<{
  job: Job;
}>();
// const applys = defineModel<Apply[]>("applys", { default: [] });

const container = useTemplateRef("container");
const emit = defineEmits<(e: "update", apply: Apply) => void>();
</script>

<template>
  <div
    ref="container"
    class="flex gap-2 flex-1 overflow-hidden overflow-x-auto pb-3"
  >
    <ui-apply-kanban-grid
      v-for="status in ApplyStatus"
      :key="status"
      :job
      :status
    />
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
  }
}
</style>
