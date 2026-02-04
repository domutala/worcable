<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const route = useRoute();

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: "Docs",
    to: "/docs/getting-started",
    active: route.path.startsWith("/docs/getting-started"),
  },
  {
    label: "Components",
    to: "/docs/components",
    active: route.path.startsWith("/docs/components"),
  },
  {
    label: "Figma",
    to: "https://go.nuxt.com/figma-ui",
    target: "_blank",
  },
  {
    label: "Releases",
    to: "https://github.com/nuxt/ui/releases",
    target: "_blank",
  },
]);
</script>

<template>
  <header class="flex items-center px-10 py-3">
    <div class="flex items-center gap-2">
      <u-icon name="i-simple-icons-okta" class="size-8" />
      <div class="font-black text-2xl uppercase">Twitter</div>
    </div>

    <div class="mx-auto"></div>

    <UColorModeButton />
  </header>
</template>
