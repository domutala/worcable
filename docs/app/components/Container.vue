<script setup lang="ts">
defineProps<{
  tag?: string;
  ui?: { root?: string; content?: string; container?: string };
}>();
</script>

<template>
  <div
    :class="ui?.root"
    class="ui-section group not-last:[&_.ui-section--content]:border-b"
  >
    <slot name="top" />

    <div
      data-slot="container"
      :class="ui?.container"
      class="flex justify-center"
    >
      <slot name="left" />

      <component
        data-slot="content"
        :is="tag || 'section'"
        :class="ui?.content"
        class="ui-section--content border-default border-x max-w-340 w-full relative"
      >
        <slot />
      </component>

      <slot name="right" />
    </div>

    <slot name="bottom" />
  </div>
</template>
