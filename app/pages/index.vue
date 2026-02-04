<script lang="ts" setup>
async function onChnage(file?: File | null) {
  if (!file) return;

  try {
    const formData = new FormData();
    formData.append("file", file);

    await $fetch("/api/upload", { method: "post", body: formData });
  } catch (err) {
    console.log(err);
  }
}
</script>

<template>
  <UFileUpload @update:model-value="onChnage" class="w-96 min-h-48" />
  Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat dolores
  dignissimos assumenda sunt tenetur doloribus! Earum blanditiis ab iure
  voluptates, rerum minima ad, adipisci nulla porro recusandae quam eveniet
  quidem!
</template>
