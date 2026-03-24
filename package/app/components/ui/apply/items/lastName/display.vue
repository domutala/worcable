<script lang="ts" setup>
defineProps<{ lastName: string }>();
</script>

<template>
  <template v-if="!$slots.default">
    {{ lastName }}
  </template>
  <slot :last-name />
</template>
