<script lang="ts" setup>
import type { BreadcrumbItem } from "@nuxt/ui";

const { breads } = defineProps<{
  breads: Array<"$home" | "$admin" | BreadcrumbItem>;
}>();

const _breads = computed(() => {
  const items: BreadcrumbItem[] = [
    ...breads.map((bread) => {
      if (bread === "$home") {
        return {
          icon: "i-lucide-home",
          to: Use.localePath({ name: "index" }),
        };
      } else if (bread === "$admin") {
        return {
          label: Use.i18n.t("words.dashboard"),
          icon: "i-lucide-layout-dashboard",
          to: Use.localePath({ name: "admin" }),
        };
      }

      return bread;
    }),
  ];

  return items;
});
</script>

<template>
  <div
    class="sticky top-0 z-50 backdrop-blur-2xl bg-surface/10 px-5 py-2 border-b border-default"
  >
    <UBreadcrumb :items="_breads" />

    <slot />
  </div>
</template>
