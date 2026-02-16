<script setup lang="ts"></script>

<template>
  <nuxt-link :to="$localePath({ name: 'index' })">
    <ui-logo-app v-if="!Store.config.config.orgName" />
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
</template>
