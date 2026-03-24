<script lang="ts" setup>
defineProps<{ email: string }>();
</script>

<template>
  <template v-if="!$slots.default">
    <a
      target="_blank"
      class="underline hover:text-primary"
      :href="`mailto:${email}`"
    >
      {{ email }}
    </a>
  </template>
  <slot :email />
</template>
