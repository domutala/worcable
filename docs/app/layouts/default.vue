<script setup lang="ts"></script>

<template>
  <!-- <Container class="hidden" :ui="{ content: 'min-h-8' }">
    <div class="bg-primary text-black p-5 relative">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae placeat
      iste fuga nihil consectetur ducimus quisquam, error rem illum eaque
      incidunt est quas in reiciendis alias officia illo aut. Libero.
    </div>
  </Container> -->

  <Container :ui="{ root: 'sticky top-0 z-50', content: 'bg-surface/70' }">
    <AppHeader />
  </Container>

  <slot />

  <Container class="relative" :ui="{ content: 'relative' }">
    <template #top> </template>

    <div
      class="relative w-full border-b border-b-default py-5 bg-primary-50/50 dark:bg-black/20 backdrop-blur-xl"
    >
      <div
        class="relative z-10 w-full flex flex-col justify-start items-center gap-5 px-5 sm:px-0 py-10 md:py-30 mx-auto max-w-210"
      >
        <h2 class="text-center text-5xl">
          <MDC :value="$t('book_demo.title')" unwrap="p" />
        </h2>

        <p class="text-xl text-center">
          <MDC :value="$t('book_demo.description')" unwrap="p" />
        </p>

        <u-button
          :to="$localePath({ name: 'book-demo' })"
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
