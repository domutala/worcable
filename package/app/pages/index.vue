<script lang="ts" setup></script>

<template>
  <div class="min-h-screen relative flex flex-col">
    <u-container class="py-36 max-w-200 text-center">
      <h1
        class="text-3xl sm:text-4xl lg:text-6xl bg-linear-to-r from-black dark:from-white to-primary text-transparent bg-clip-text"
      >
        <MDC :value="$t('pages.index.hero.title')" unwrap="p" />
      </h1>

      <div
        class="flex items-center gap-2 sm:flex-row flex-col justify-center mt-10"
      >
        <u-button
          href="https://github.com/domutala/worcable"
          target="_blank"
          size="xl"
          color="primary"
          variant="solid"
          class="p-3 px-4 rounded-xl"
          icon="i-simple-icons-github"
        >
          {{ $t("pages.index.hero.cta_2") }}
        </u-button>

        <u-chip
          size="3xl"
          color="warning"
          :ui="{ base: 'p-2 px-1 h-5 rounded-sm' }"
        >
          <template #content>
            <div class="text-md">Soon</div>
          </template>

          <u-button
            size="xl"
            variant="soft"
            color="neutral"
            icon="i-lucide-newspaper"
            class="border-default p-3 px-4 border rounded-xl"
          >
            {{ $t("pages.index.hero.cta") }}
          </u-button>
        </u-chip>
      </div>
    </u-container>

    <div
      class="mt-auto mb-15 rotate--45 origin-bottom mx-auto w-120 max-w-[90%] shadow-xl ring-1 ring-default rounded-3xl overflow-auto pb-1 block md:hidden"
    >
      <img
        :src="
          $colorMode.value === 'dark'
            ? '/images/screenshot_mobile_dark.jpeg'
            : '/images/screenshot_mobile_light.jpeg'
        "
        class="mt-auto object-cover object-top border-default w-full"
      />
    </div>

    <div
      class="mt-auto mb-15 rotate--45 origin-bottom mx-auto max-w-400 w-11/12 shadow-xl ring-1 ring-default rounded-2xl overflow-auto pb-1 hidden md:block"
    >
      <div class="py-2 flex items-center gap-2 px-5 border-b border-default">
        <div class="size-3 rounded-full bg-green-500"></div>
        <div class="size-3 rounded-full bg-yellow-500"></div>
        <div class="size-3 rounded-full bg-red-500"></div>
      </div>
      <img
        :src="
          $colorMode.value === 'dark'
            ? '/images/screenshot_desktop_dark.jpeg'
            : '/images/screenshot_desktop_light.jpeg'
        "
        class="mt-auto object-cover object-top border-default"
      />
    </div>
  </div>
  <u-container class="py-10"> </u-container>
</template>
