<script lang="ts" setup>
defineProps<{ availability?: string }>();
</script>

<template>
  <template v-if="availability">
    <template v-if="!$slots.default">
      {{ $t(`apply.items.availability.items.${availability}`) }}
    </template>
    <slot :availability />
  </template>
  <template v-else>
    <template v-if="!$slots.empty">-</template>
    <slot name="empty" />
  </template>
</template>
