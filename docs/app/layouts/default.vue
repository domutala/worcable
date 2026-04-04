<script setup lang="ts"></script>

<template>
  <!-- <Container :ui="{ content: 'min-h-8' }"> </Container> -->

  <Container :ui="{ root: 'sticky top-0 z-50', content: 'bg-surface/40' }">
    <AppHeader />
  </Container>

  <slot />

  <Container class="relative" :ui="{ content: 'relative' }">
    <template #top>
      <div class="absolute left-0 w-full top-0 bottom-0 bg-">
        <div class="absolute inset-0 object-cover object-center">
          <img
            src="/images/bloom.png"
            class="size-full object-cover object-center"
          />

          <div class="absolute backdrop-blur-2xl inset-0 bg-default/80"></div>
        </div>

        <div
          class="absolute h-100 w-full bg-linear-to-b from-body to-transparent"
        ></div>
      </div>
    </template>

    <div
      class="relative w-full border-b border-b-default py-5 bg-primary-200 backdrop-blur-xl"
    >
      <div
        class="relative z-10 w-full flex flex-col justify-start items-center gap-5 px-5 sm:px-0 py-10 md:py-30 mx-auto max-w-210"
      >
        <h2 class="text-center text-black text-5xl">
          <MDC :value="$t('book_demo.title')" unwrap="p" />
        </h2>

        <p class="text-black text-xl text-center">
          <MDC :value="$t('book_demo.description')" unwrap="p" />
        </p>

        <u-button
          :to="$localePath({ name: 'contact' })"
          variant="soft"
          color="primary"
          size="xl"
          class="button mt-5 px-7 py-4 rounded-xl cursor-pointer bg-black text-white hover:bg-primary-950"
          icon="i-lucide-video"
        >
          {{ $t("book_demo.cta") }}
        </u-button>
      </div>
    </div>

    <div class="bg-">
      <AppFooter />
    </div>
  </Container>
</template>
