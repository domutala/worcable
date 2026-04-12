<script setup lang="ts">
import UiAuth from "./auth.vue";
</script>

<template>
  <header
    v-if="Store.config.config"
    class="flex items-center gap-3 px-3 sm:px-6 py-3 w-full"
  >
    <ui-logo shortable />

    <div class="w-15 mr-auto"></div>

    <ui-auth />
  </header>
</template>
