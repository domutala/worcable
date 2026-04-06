<script setup lang="ts">
const { $docs } = useNuxtApp();

const filteredNavigation = computed(() => {
  return $docs.navigation.value;
});
</script>

<template>
  <UContentNavigation
    class="px-5 pt-5"
    highlight
    :navigation="filteredNavigation"
    :collapsible="true"
  >
    <template #link-title="{ link, ui }">
      {{ link.title }}
    </template>

    <template #link-trailing="{ link }">
      <UBadge v-if="link.soon" color="neutral" variant="outline" label="soon" />
      <template v-if="link.children?.length">
        <u-icon
          name="i-lucide-chevron-right"
          class="opacity-50 ransform transition-transform group-data-[state=open]:rotate-90"
        />
      </template>
    </template>
  </UContentNavigation>
</template>
