<script setup lang="ts">
import type { ContentNavigationItem } from "@nuxt/content";

const { header } = useAppConfig();

const navigation = inject<Ref<ContentNavigationItem[]>>("navigation");
const filteredNavigation = computed(() => {
  return navigation?.value.filter((n) => !n.path.startsWith("/docs"));
});
</script>

<template>
  <UHeader
    class="border-b-0 bg-transparent"
    :ui="{ center: 'flex-1', container: 'max-w-full' }"
    :to="$localePath({ name: 'index' })"
  >
    <template #title>
      <AppLogo class="w-auto h-6 shrink-0" />
    </template>

    <template #right>
      <UContentSearchButton v-if="header?.search" class="lg:hidden" />

      <template v-if="header?.links">
        <UButton
          v-for="(link, index) of header.links"
          :key="index"
          v-bind="{ color: 'neutral', variant: 'ghost', ...link }"
        />
      </template>
    </template>

    <template #body>
      <UContentNavigation highlight :navigation="filteredNavigation" />
    </template>
  </UHeader>
</template>
