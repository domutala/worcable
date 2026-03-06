<script lang="ts" setup>
import UiHeader from "~/components/header.vue";

onMounted(() => {
  useCookieConsent().init();
});
</script>

<template>
  <UApp>
    <div class="h-screen flex flex-col">
      <ui-header v-if="!$slots.header" />
      <slot name="header" />

      <div
        class="bg-surface flex-1 m-2 rounded-2xl overflow-auto border border-default flex flex-col"
      >
        <slot />
      </div>
    </div>
  </UApp>
</template>
