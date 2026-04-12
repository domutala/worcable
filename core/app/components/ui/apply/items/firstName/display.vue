<script lang="ts" setup>
defineProps<{ firstName: string }>();
</script>

<template>
  <template v-if="!$slots.default">
    {{ firstName }}
  </template>
  <slot :first-name />
</template>
