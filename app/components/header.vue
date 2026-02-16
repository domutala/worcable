<script setup lang="ts">
import UiAuth from "./auth.vue";
</script>

<template>
  <header
    v-if="Store.config.config"
    class="flex items-center gap-3 px-3 sm:px-10 py-3 w-full"
  >
    <ui-logo />

    <div class="w-15"></div>

    <ui-auth />
  </header>
</template>
