<script lang="ts" setup>
import { useFavicon } from "@vueuse/core";
import onFetchError from "./tools/onFetchError";

const initing = ref(true);
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
  ogTitle: `${title} - ${Use.i18n.t("site.ogDescription")}`,
  ogDescription: Use.i18n.t("site.ogDescription"),
  // ogImage: "https://ui.nuxt.com/assets/templates/nuxt/starter-light.png",
});

useFavicon("favicon-light.png");

onMounted(async () => {
  try {
    await Store.config.init();
    await Store.session.init();
  } catch (error) {
    onFetchError(error);
  } finally {
    initing.value = false;
  }
});
</script>

<template>
  <NuxtLoadingIndicator color="var(--ui-primary)" :height="5" />

  <UApp>
    <div
      v-if="initing"
      class="w-screen h-screen flex items-center justify-center"
    >
      <u-icon
        name="i-lucide-loader-circle"
        class="text-primary animate-spin size-10"
      />
    </div>
    <NuxtLayout v-else-if="Store.config.config">
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
