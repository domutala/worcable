<script lang="ts" setup>
defineProps<{ slim?: boolean }>();
</script>

<template>
  <!-- fixed top-0 left-0 z-150  -->
  <u-button
    variant="ghost"
    class="rounded-none size-15 border-default/50 flex items-center justify-center p-0"
    :class="{ 'size-8': slim }"
    :to="$localePath({ name: 'admin' })"
  >
    <u-icon name="i-lucide-menu" class="size-6" :class="{ 'size-5': slim }" />
  </u-button>
</template>
