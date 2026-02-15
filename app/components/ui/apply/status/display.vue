<script lang="ts" setup>
import { applyStatusColors, applyStatusIcons } from "~/tools/apply";
import type { Job } from "~~/server/database/schema";

const job = defineModel<Job>("job", { required: true });
const status = defineModel<string | null>("status", {});

const color = computed(() => {
  return !status.value
    ? "var(--color-surface)"
    : (job.value.applyStatus.find((s) => s.key === status.value)?.color ??
        applyStatusColors[status.value]);
});

const bgColor = computed(() => {
  return !status.value
    ? "var(--color-surface)"
    : `color-mix(in srgb, ${color.value} 10%, #000 0%)`;
});

const borderColor = computed(() => {
  return !status.value
    ? "var(--ui-border)"
    : `color-mix(in srgb, ${color.value} 20%, #000 0%)`;
});

const label = computed(() => {
  const applyStatus = job.value.applyStatus.find((s) => s.key === status.value);

  if (!applyStatus) return Use.i18n.t("apply.status.NULL_STATUS.label");
  if (applyStatus?.label) return applyStatus.label;

  let label = Use.i18n.t(`apply.status.${status.value}.label`);
  if (label === `apply.status.${status.value}.label`) {
    label = Use.i18n.t(`job.items.applyStatus.labels.without_name`);
  }

  return label;
});

const icon = computed(() => {
  const applyStatus = job.value.applyStatus.find((s) => s.key === status.value);

  if (!applyStatus) return applyStatusIcons.null;
  return applyStatus?.icon ?? applyStatusIcons[applyStatus.key];
});
</script>

<template>
  <slot :color :bg-color :label :icon :border-color class="bdorder-default" />
</template>
