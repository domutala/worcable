<script lang="ts" setup>
definePageMeta({ layout: "admin" });
const runtime = useRuntimeConfig();
</script>

<template>
  <ui-apply-modal />
  <ui-user-invite />

  <nuxt-page />

  <div class="fixed bottom-5 right-10 z-500">
    <u-link class="text-sm" to="https://worcable.netlify.app/" target="_blank">
      v{{ runtime.public.version }}
    </u-link>
  </div>
</template>
