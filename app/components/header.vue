<script setup lang="ts">
import UiAuth from "./auth.vue";
</script>

<template>
  <header
    v-if="Store.config.config"
    class="flex items-center gap-3 px-3 sm:px-10 py-3 w-full"
  >
    <nuxt-link :to="$localePath({ name: 'index' })">
      <ui-logo v-if="!Store.config.config.orgName" />
      <div v-else class="flex items-center gap-1">
        <div
          class="size-10 rounded-xl bg-surface flex items-center justify-center overflow-hidden"
        >
          <img
            v-if="Store.config.config.logo"
            :src="Utils.getFileUrl(Store.config.config.logo)"
            class="size-full object-cover object-center"
          />
          <u-icon v-else name="i-lucide-building-2" class="size-6 text-" />
        </div>
        <div class="font-semibold text-2xl select-none">
          {{ Store.config.config.orgName }}
        </div>
      </div>
    </nuxt-link>

    <div class="mx-auto"></div>

    <!-- <UColorModeButton size="xl"> </UColorModeButton> -->

    <div class="hidden md:flex items-center gap-1">
      <template v-if="$route.path.startsWith('/admin')">
        <u-button
          icon="i-lucide-users-round"
          size="xl"
          color="neutral"
          variant="ghost"
        ></u-button>

        <u-button
          icon="i-lucide-mail-open"
          size="xl"
          color="neutral"
          variant="ghost"
        ></u-button>

        <u-button
          icon="i-lucide-bell-dot"
          size="xl"
          color="neutral"
          variant="ghost"
        ></u-button>
      </template>

      <u-button
        v-else
        icon="i-lucide-layout-dashboard"
        size="lg"
        color="neutral"
        :to="$localePath({ name: 'admin' })"
      >
        Dashboard
      </u-button>
    </div>

    <UiAuth />
  </header>
</template>
