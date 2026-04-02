<script setup lang="ts">
const colorMode = useColorMode();

const preference = computed({
  get: () => colorMode.preference,
  set(val) {
    colorMode.preference = val;
  },
});
</script>

<template>
  <div class="flex items-center gap-1">
    <u-button
      color="neutral"
      size="lg"
      icon="i-lucide-laptop-minimal"
      :variant="preference === 'system' ? 'soft' : 'ghost'"
      class="cursor-pointer"
      square
      @click="preference = 'system'"
    />

    <u-button
      color="neutral"
      size="lg"
      icon="i-lucide-sun"
      :variant="preference === 'light' ? 'soft' : 'ghost'"
      class="cursor-pointer"
      square
      @click="preference = 'light'"
    />

    <u-button
      color="neutral"
      size="lg"
      icon="i-lucide-moon"
      :variant="preference === 'dark' ? 'soft' : 'ghost'"
      class="cursor-pointer"
      square
      @click="preference = 'dark'"
    />
  </div>
</template>
