<script setup lang="ts">
const { header } = useAppConfig();
</script>

<template>
  <UHeader
    class="border-b-0 bg-transparent"
    toggle-side="left"
    mode="slideover"
    :ui="{
      center: 'flex-1',
      container: 'max-w-full',
      content: 'max-w-80 ui-scroll overflow-auto',
    }"
    :menu="{ side: 'left', ui: {} }"
    :to="$localePath(header.to)"
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

    <template #content>
      <DocNavigation />
    </template>
  </UHeader>
</template>

<style lang="scss">
.ui-scroll-hover,
.ui-scroll {
  &::-webkit-scrollbar {
    width: 5px;
    transition: all 0.5s ease;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--ui-border);

    &:hover {
      background-color: var(--ui-bg-inverted);
    }
  }

  &.ui-scroll-hover {
    &:not(:hover) {
      &::-webkit-scrollbar {
        width: 0px;
      }
    }
  }
}
</style>
