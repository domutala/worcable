<script lang="ts" setup>
import UiHeader from "~/components/header.vue";

onMounted(() => {
  useCookieConsent().init();
});
</script>

<template>
  <UApp>
    <u-main class="h-screen bg-default">
      <div class="h-full flex flex-col mx-auto">
        <ui-header v-if="!$slots.header" />
        <slot name="header" />

        <div
          class="bg-surface flex-1 mx-2 my-2 rounded-2xl overflow-hidden border border-default flex flex-col"
        >
          <slot />
        </div>
      </div>
    </u-main>
  </UApp>
</template>
