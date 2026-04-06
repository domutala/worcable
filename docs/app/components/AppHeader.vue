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
    mode="slideover"
    :ui="{
      center: 'flex-1',
      container: 'max-w-full',
      content: 'max-w-80 ui-scroll overflow-auto',
    }"
    :to="$localePath({ name: 'index' })"
  >
    <template #title>
      <AppLogo />
    </template>

    <AppMenu />

    <template #right>
      <UButton
        size="xl"
        variant="solid"
        color="primary"
        class="rounded-4xl border-2 border-primary cursor-pointer"
      >
        {{ $t("header.book_demo") }}
      </UButton>

      <UButton
        size="xl"
        variant="ghost"
        color="neutral"
        class="rounded-4xl border-2 border-primary cursor-pointer"
      >
        {{ $t("header.get_started") }}
      </UButton>
    </template>

    <template #content>
      <AppMenu orientation="vertical" class="p-2.5" />
    </template>
  </UHeader>
</template>
