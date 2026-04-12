<script lang="ts" setup>
defineProps<{ ui?: Partial<{ content: string; border?: string }> }>();
</script>

<template>
  <slot name="top" />

  <div
    class="absolute inset-0 bg-surface rounded-[inherit] opacity-37 dark:opacity-35"
  ></div>

  <div class="flex-1 flex flex-col overflow-auto relative" :class="ui?.content">
    <slot />
  </div>

  <slot name="bottom" />
</template>
