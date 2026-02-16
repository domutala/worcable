<script lang="ts" setup>
import UiHeader from "~/components/header.vue";
</script>

<template>
  <header
    class="sticky top-0 z-50 backdrop-blur-2xl flex items-center gap-10 px-10 py-3"
  >
    <ui-logo />

    <ui-menu-horizontal
      v-if="Store.session.user"
      :ui="{ base: 'justify-end' }"
      :gap="10"
    >
      <u-button
        v-if="Store.session.user"
        icon="i-lucide-layout-dashboard"
        size="lg"
        color="neutral"
        variant="soft"
        :to="$localePath({ name: 'admin' })"
        :ui="{ base: '' }"
      >
        Dashboard
      </u-button>
      <u-button
        v-else
        size="lg"
        color="neutral"
        variant="soft"
        :to="$localePath({ name: 'login' })"
      >
        {{ $t("login.labels.title") }}
      </u-button>
    </ui-menu-horizontal>
  </header>

  <slot />
</template>
