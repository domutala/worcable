<script lang="ts" setup>
useHead({
  meta: [{ name: "viewport", content: "width=device-width, initial-scale=1" }],
  link: [{ rel: "icon", href: "/favicon.ico" }],
  htmlAttrs: { lang: "en" },
});
</script>

<template>
  <NuxtLoadingIndicator color="var(--ui-primary)" :height="5" />

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
