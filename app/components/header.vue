<script setup lang="ts"></script>

<template>
  <header class="flex items-center gap-2 px-10 py-3">
    <div class="flex items-center gap-1">
      <u-icon name="i-simple-icons-okta" class="size-8 text-primary" />
      <div class="font-bold text-2xl select-none uppercase">
        <span class="opacity-50">Wor</span>
        <span>cable</span>
      </div>
    </div>

    <div class="mx-auto"></div>

    <UColorModeButton size="xl"> </UColorModeButton>
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

    <UAvatar
      src="https://github.com/benjamincanac.png"
      size="xl"
      class="rounded-2xl"
      :chip="{ inset: true }"
      ,
    />
  </header>
</template>
