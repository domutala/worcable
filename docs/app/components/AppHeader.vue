<script setup lang="ts"></script>

<template>
  <UHeader
    class="border-b-0 bg-transparent"
    mode="slideover"
    :ui="{
      center: 'flex-1',
      container: 'max-w-full',
      content: 'max-w-80 ui-scroll overflow-auto',
    }"
    :to="$localePath({ name: 'index' })"
  >
    <template #title>
      <AppLogo />
    </template>

    <AppMenu />

    <template #right>
      <UButton
        :to="$localePath({ name: 'docs-slug', params: { slug: 'deployment' } })"
        size="xl"
        variant="soft"
        color="neutral"
        class="rounded-4xl cursor-pointer border border-default"
      >
        {{ $t("header.get_started") }}
      </UButton>

      <UButton
        :to="$localePath({ name: 'book-demo' })"
        size="xl"
        variant="solid"
        color="primary"
        class="rounded-4xl cursor-pointer"
      >
        {{ $t("header.book_demo") }}
      </UButton>
    </template>

    <template #content>
      <AppMenu orientation="vertical" class="p-2.5" />
    </template>
  </UHeader>
</template>
