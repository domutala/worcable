<script lang="ts" setup>
import { type Apply, type Job } from "~~/server/database/schema";
import { ApplyStatus } from "~~/server/services/apply_get_shema";

const job = defineModel<Job>("job", { required: true });
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
      :status
      v-model:job="job"
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
