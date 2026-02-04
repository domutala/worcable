<script lang="ts" setup>
import { useFavicon, usePreferredDark } from "@vueuse/core";
import { computed } from "vue";

const appConfig = useAppConfig();
const title = appConfig.site.name;

useHead({
  meta: [{ name: "viewport", content: "width=device-width, initial-scale=1" }],
  link: [{ rel: "icon", href: "/favicon.ico" }],
  htmlAttrs: { lang: "en" },
});

useSeoMeta({
  title: `${title} - ${Use.i18n.t("site.description")}`,
  description: Use.i18n.t("site.description"),
  ogTitle: `${title} - ${Use.i18n.t("site.description")}`,
  ogDescription: Use.i18n.t("site.description"),
  // ogImage: "https://ui.nuxt.com/assets/templates/nuxt/starter-light.png",
});

useFavicon("favicon-light.png");
</script>

<template>
  <NuxtLoadingIndicator color="var(--ui-primary)" :height="5" />

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
