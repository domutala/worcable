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

  <Container :ui="{ content: 'bg-surface' }">
    <UContainer class="py-30">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed quae voluptas
      repudiandae, suscipit quidem laborum temporibus eum pariatur aperiam enim
      aliquid illo id itaque libero aliquam hic cumque beatae nemo. Lorem ipsum
      dolor sit amet consectetur adipisicing elit. Sed quae voluptas
      repudiandae, suscipit quidem laborum temporibus eum pariatur aperiam enim
      aliquid illo id itaque libero aliquam hic cumque beatae nemo. Lorem ipsum
      dolor sit amet consectetur adipisicing elit. Sed quae voluptas
      repudiandae, suscipit quidem laborum temporibus eum pariatur aperiam enim
      aliquid illo id itaque libero aliquam hic cumque beatae nemo.
    </UContainer>
  </Container>
</template>
