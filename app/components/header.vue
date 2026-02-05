<script setup lang="ts"></script>

<template>
  <header class="flex items-center gap-3 px-10 py-3">
    <nuxt-link
      :to="$localePath({ name: 'index' })"
      class="flex items-center gap-1"
    >
      <u-icon name="i-simple-icons-okta" class="size-8 text-primary" />
      <div class="font-bold text-2xl select-none uppercase">
        <span class="opacity-50">Wor</span>
        <span>cable</span>
      </div>
    </nuxt-link>

    <div class="mx-auto"></div>

    <UColorModeButton size="xl"> </UColorModeButton>

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

    <UAvatar
      src="https://github.com/benjamincanac.png"
      size="xl"
      class="rounded-2xl"
      :chip="{ inset: true }"
    />
  </header>
</template>
