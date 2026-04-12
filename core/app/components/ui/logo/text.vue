<script lang="ts" setup>
defineProps<{ text?: string }>();
</script>

<template>
  <div class="font-bold opacity-50 group-hover/logo:opacity-100 text-default">
    <template v-if="text">
      {{ text }}
    </template>

    <template v-else>
      <span class="uppercase">Worc</span>
      <span class="uppercase">able</span>
    </template>
  </div>
</template>
