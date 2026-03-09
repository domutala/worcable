<script lang="ts" setup>
definePageMeta({ layout: "admin" });
</script>

<template>
  <ui-apply-modal />
  <ui-user-invite />

  <nuxt-page />

  <u-button
    v-if="$routeBaseName({ name: $route.name }) !== 'admin'"
    class="fixed bottom-10 left-0 z-99 rounded-l-none rounded-r-min ring-0 shadow-lg"
    variant="outline"
    icon="i-lucide-house"
    square
    :to="Use.localePath({ name: 'admin' })"
  >
  </u-button>
</template>
