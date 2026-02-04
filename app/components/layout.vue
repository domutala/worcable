<script lang="ts" setup>
import UiHeader from "~/components/header/index.vue";

const appConfig = useAppConfig();
const title = appConfig.site.name;
const i18n = useI18n();

useSeoMeta({
  title: `${title} - ${i18n.t("site.description")}`,
  description: i18n.t("site.description"),
  ogTitle: `${title} - ${i18n.t("site.description")}`,
  ogDescription: i18n.t("site.description"),
  // ogImage: "https://ui.nuxt.com/assets/templates/nuxt/starter-light.png",
});

onMounted(() => {
  useCookieConsent().init();
});
</script>

<template>
  <UApp>
    <u-main class="h-screen bg-default">
      <div class="h-full flex flex-col mx-auto">
        <ui-header v-if="!$slots.header" />
        <slot name="header" />

        <div
          class="bg-surface flex-1 mx-2 my-2 rounded-2xl overflow-hidden border border-default flex flex-col"
        >
          <slot />
        </div>
      </div>
    </u-main>
  </UApp>
</template>
