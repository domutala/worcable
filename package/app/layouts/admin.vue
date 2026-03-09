<script lang="ts" setup>
import UiAuth from "~/components/auth.vue";
</script>

<template>
  <ui-layout v-if="Store.config.config" class="h-screen">
    <template #header>
      <header class="flex items-center gap-3 px-3 sm:px-6 py-3 w-full relative">
        <nuxt-link :to="$localePath({ name: 'admin' })">
          <ui-logo-app shortable />
        </nuxt-link>

        <div class="w-15 mr-auto"></div>

        <ui-auth />
      </header>
    </template>

    <slot />
  </ui-layout>
</template>
