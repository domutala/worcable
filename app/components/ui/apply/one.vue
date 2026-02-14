<script lang="ts" setup>
import type { Apply, Job } from "~~/server/database/schema";

const emit = defineEmits<(e: "refesh:apply", apply: Apply) => void>();

const job = defineModel<Job>("job", { required: true });
const apply = defineModel<Apply>("apply", { required: true });

onMounted(() => {
  window.addEventListener(`${apply.value.id}:update`, (e: any) =>
    onUpdataed(e),
  );
});

onBeforeUnmount(() => {
  window.removeEventListener(`${apply.value.id}:update`, (e: any) =>
    onUpdataed(e),
  );
});

function onUpdataed(e: CustomEvent) {
  apply.value = e.detail;
  emit("refesh:apply", e.detail);
}
</script>

<template>
  <slot :job :apply />
</template>
