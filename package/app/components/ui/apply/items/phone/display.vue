<script lang="ts" setup>
defineProps<{ phone: string }>();
</script>

<template>
  <template v-if="!$slots.default">
    <a
      target="_blank"
      class="underline hover:text-primary"
      :href="`tel:${phone}`"
    >
      {{ phone }}
    </a>
  </template>
  <slot :phone />
</template>
