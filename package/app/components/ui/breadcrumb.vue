<script lang="ts" setup>
import type { BreadcrumbItem } from "@nuxt/ui";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

const breakpoints = useBreakpoints(breakpointsTailwind);
const sm = breakpoints.smallerOrEqual("sm");

const { breads } = defineProps<{
  breads: Array<"$home" | "$admin" | BreadcrumbItem>;
}>();

const _breads = computed(() => {
  let items: BreadcrumbItem[] = [
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

  if (sm.value) {
    items = [
      Use.route.path == "/admin"
        ? {
            icon: "i-lucide-home",
            to: Use.localePath({ name: "index" }),
          }
        : {
            label: Use.i18n.t("words.dashboard"),
            icon: "i-lucide-layout-dashboard",
            to: Use.localePath({ name: "admin" }),
          },
    ];
  }

  return items;
});
</script>

<template>
  <div
    class="sticky top-0 z-50 backdrop-blur-2xl bg-default/20 px-5 py-2 border-default flex items-center"
  >
    <UBreadcrumb :items="_breads" />

    <slot />
  </div>
</template>
