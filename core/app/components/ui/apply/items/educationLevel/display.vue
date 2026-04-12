<script lang="ts" setup>
defineProps<{ educationLevel?: string }>();
</script>

<template>
  <template v-if="educationLevel">
    <template v-if="!$slots.default">
      {{ $t(`apply.items.educationLevel.items.${educationLevel}`) }}
    </template>
    <slot :education-level />
  </template>
  <template v-else>
    <template v-if="!$slots.empty">-</template>
    <slot name="empty" />
  </template>
</template>
