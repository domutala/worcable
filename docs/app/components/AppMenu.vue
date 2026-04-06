<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const { docHomePage, repository, footer } = useAppConfig();
const { t: $t } = useI18n();
const localePath = useLocalePath();

const items = ref<NavigationMenuItem[]>([
  {
    label: $t("header.why_worcable.title"),
    to: localePath({
      name: "docs-slug",
      params: { slug: ["what-is-worcable"] },
    }),
  },

  {
    label: $t("header.documentation.title"),
    to: localePath(docHomePage),
  },

  {
    label: "Services",
    children: footer.groups["03.services"].links.map((link) => {
      link.label = $t(link.label);
      return link;
    }),
  },

  {
    label: "GitHub",
    icon: "i-simple-icons-github",
    // badge: "6k",
    to: repository,
    target: "_blank",
  },
]);
</script>

<template>
  <UNavigationMenu :items />
</template>
