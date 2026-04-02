<script setup lang="ts">
const { header, repository } = useAppConfig();
</script>

<template>
  <Container>
    <u-container class="py-36 max-w-270 text-center">
      <h1 class="text-6xl font-bold">
        <MDC :value="$t('pages.index.hero.title')" unwrap="p" />
      </h1>

      <p class="mt-2">
        {{ $t("pages.index.hero.subtitle") }}
      </p>

      <div
        class="flex items-center gap-2 sm:flex-row flex-col justify-center mt-10"
      >
        <u-button
          :to="$localePath(header.to)"
          size="xl"
          color="primary"
          variant="solid"
          class="p-3 px-4"
          icon="i-lucide-message-circle-code"
        >
          {{ $t("pages.index.hero.cta") }}
        </u-button>
        <u-button
          :href="repository"
          target="_blank"
          size="xl"
          variant="soft"
          color="neutral"
          icon="i-simple-icons-github"
          class="border-default p-3 px-4"
        >
          {{ $t("pages.index.hero.cta_2") }}
        </u-button>
      </div>
    </u-container>
  </Container>

  <Container
    :ui="{
      content: 'bg-surface relative overflow-hidden',
    }"
  >
    <div class="absolute inset-0 object-cover object-center bg-amber-500">
      <img
        src="/images/bloom.png"
        class="size-full object-cover object-center"
      />
    </div>

    <div
      class="mt-35 mx-auto max-w-220 w-11/12 ring- ring-primary-200 rounded-t-2xl overflow-auto bg-default relative"
    >
      <div class="py-2 hidden items-center gap-2 px-5 border-b border-default">
        <div class="size-3 rounded-full bg-green-500"></div>
        <div class="size-3 rounded-full bg-yellow-500"></div>
        <div class="size-3 rounded-full bg-red-500"></div>
      </div>

      <img
        src="/images/screenshot_desktop_light.jpeg"
        class="mt-auto object-cover object-top border-default block"
      />
    </div>
  </Container>
</template>
