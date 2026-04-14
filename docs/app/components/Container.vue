<script setup lang="ts">
defineProps<{
  tag?: string;
  ui?: { root?: string; content?: string; container?: string };
}>();
</script>

<template>
  <component
    :is="tag || 'section'"
    :class="ui?.root"
    class="app-container group not-last:[&_.app-container--content]:border-b"
  >
    <slot name="top" />

    <div
      data-slot="container"
      :class="ui?.container"
      class="flex justify-center"
    >
      <slot name="left" />

      <div
        data-slot="content"
        :class="ui?.content"
        class="app-container--content border-default border-x max-w-340 w-full relative"
      >
        <slot />
      </div>

      <slot name="right" />
    </div>

    <slot name="bottom" />
  </component>
</template>
