<script lang="ts" setup>
defineProps<{ ui?: Partial<{ content: string; border?: string }> }>();
</script>

<template>
  <slot name="header" />

  <div
    class="relative h-0.5 w-full bg-linear-to-l from-transparent to-primary/30 border-b-0!"
    :class="ui?.border"
  ></div>

  <div
    class="flex-1 flex flex-col overflow-hidden relative border-primary/15"
    :class="ui?.content"
  >
    <div class="flex-1 overflow-hidden flex flex-col relative">
      <div
        class="absolute inset-0 bg-linear-to-br from-inverted/2 to-primary/7 dark:to-primary/2 rounded-[inherit]"
      ></div>

      <div class="relative flex-1 flex flex-col overflow-auto scroller">
        <slot />
      </div>
    </div>
  </div>
</template>
