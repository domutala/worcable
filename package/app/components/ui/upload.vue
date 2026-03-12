<script lang="ts" setup>
import type { UploadedFile } from "~~/server/interfaces";

const value = defineModel<UploadedFile>();
const file = ref<File>();
watch(
  () => file.value,
  () => {
    value.value = file.value as any;
  },
);

async function upload() {
  if (file.value) return await Doc.upload(file.value);
  return value.value;
}

function remove() {
  value.value = undefined;
  file.value = undefined;
}
defineExpose({ upload });
</script>

<template>
  <UFileUpload v-slot="props" v-model="file">
    <slot
      v-bind="props"
      :object-url="Utils.createObjectUrl(file) || Utils.getFileUrl(value)"
      :remove
    />
  </UFileUpload>
</template>
