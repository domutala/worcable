<script lang="ts" setup>
import { useFileDialog } from "@vueuse/core";
import type { Doc } from "~~/server/database/collections";

const { accept, multiple } = defineProps<{
  accept?: string[];
  multiple?: boolean;
}>();

const {
  open,
  reset: _reset,
  onCancel,
  onChange,
} = useFileDialog({
  accept: accept?.join(", "),
  multiple,
});

const value = defineModel<Doc | Doc[]>();

const objectUrls = computed(() => {
  const urls = [];
  const values =
    (Array.isArray(value.value) ? value.value : [value.value]) || [];

  for (const file of values) {
    urls.push(Doc.createObjectUrl(file));
  }

  return urls;
});

onChange((files) => {
  if (files?.length) {
    if (multiple) value.value = (files as any) || [];
    else value.value = files?.item(0) as any;
  }
});

onCancel(() => {
  /** do something on cancel */
});

function reset() {
  value.value = undefined;
  _reset();
}
</script>

<template>
  <slot :reset :open :value :object-urls :on-cancel :on-change />
</template>
