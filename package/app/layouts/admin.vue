<script lang="ts" setup>
import UiAuth from "~/components/auth.vue";
</script>

<template>
  <ui-layout v-if="Store.config.config" class="h-screen w-full">
    <div class="sticky top-0 z-100 dark:bg-default backdrop-blur-3xl">
      <header
        class="flex items-center gap-3 pl-1 pr-3 sm:pr-6 w-full relative h-15"
      >
        <ui-menu />

        <u-link :to="$localePath({ name: 'admin' })">
          <ui-logo-app shortable />
        </u-link>

        <div class="w-15 mr-auto"></div>

        <ui-auth />
      </header>
      <div
        class="relative h-0.5 w-full bg-linear-to-l from-transparent to-primary/30"
      ></div>
    </div>

    <slot />
  </ui-layout>
</template>
