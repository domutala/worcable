<script lang="ts" setup></script>

<template>
  <u-container class="py-36 max-w-200 text-center">
    <h1
      class="text-6xl bg-linear-to-r from-black dark:from-white to-primary text-transparent bg-clip-text"
    >
      {{ $t("pages.index.hero.title") }}
    </h1>

    <div
      class="flex items-center gap-5 sm:flex-row flex-col justify-center mt-10"
    >
      <u-button
        href="https://github.com/domutala/worcable"
        target="_blank"
        size="xl"
        color="primary"
        variant="solid"
        class="p-3 px-4 rounded-3xl"
        icon="i-simple-icons-github"
      >
        {{ $t("pages.index.hero.cta_2") }}
      </u-button>
      <u-button
        :to="$localePath({ name: 'jobs' })"
        size="xl"
        variant="ghost"
        color="neutral"
        trailing-icon="i-lucide-arrow-right"
        class="border-accented p-3 px-4 border rounded-3xl"
      >
        {{ $t("pages.index.hero.cta") }}
      </u-button>
    </div>
  </u-container>

  <u-container class="py-10"> </u-container>
</template>
