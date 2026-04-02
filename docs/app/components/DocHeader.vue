<script setup lang="ts">
const { header } = useAppConfig();
</script>

<template>
  <UHeader
    class="border-b-0 bg-transparent"
    toggle-side="left"
    :ui="{
      center: 'flex-1',
      container: 'max-w-full',
      content: 'max-w-80 ui-scroll overflow-auto',
    }"
    :menu="{ side: 'left', ui: {} }"
    mode="slideover"
  >
    <template
      v-if="header?.logo?.dark || header?.logo?.light || header?.title"
      #title
    >
      <UColorModeImage
        v-if="header?.logo?.dark || header?.logo?.light"
        :light="header?.logo?.light!"
        :dark="header?.logo?.dark!"
        :alt="header?.logo?.alt"
        class="h-6 w-auto shrink-0"
      />

      <span v-else-if="header?.title">
        {{ header.title }}
      </span>
    </template>

    <template v-else #left>
      <NuxtLink to="/docs/getting-started">
        <AppLogo class="w-auto h-6 shrink-0" />
      </NuxtLink>
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
