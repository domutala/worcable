<script lang="ts" setup>
import UiAuth from "~/components/auth.vue";
</script>

<template>
  <ui-layout v-if="Store.config.config" class="h-screen w-full">
    <template #header>
      <header
        class="flex items-center gap-3 pl-1 pr-3 sm:pr-6 w-full relative h-15"
      >
        <ui-menu />

        <div :to="$localePath({ name: 'admin' })">
          <ui-logo-app shortable />
        </div>

        <div class="w-15 mr-auto"></div>

        <ui-auth />
      </header>
    </template>

    <slot />
  </ui-layout>
</template>
