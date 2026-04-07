<script lang="ts" setup>
import type { DropdownMenuItem } from "@nuxt/ui";
import UiAuth from "~/components/auth.vue";

const items = computed(() => {
  const items: DropdownMenuItem[] = [
    {
      label: $t("job.labels.title"),
      to: Use.localePath({ name: "job" }),
    },
  ];

  return items;
});
</script>

<template>
  <ui-layout>
    <template #header>
      <header
        class="sticky top-0 z-50 backdrop-blur-2xl flex items-center gap-2 md:px-10 px-3 py-3"
      >
        <u-link :to="$localePath({ name: 'index' })">
          <ui-logo shortable />
        </u-link>

        <div class="w-10 mr-auto"></div>

        <ui-menu-horizontal-items :items :gap="5" :ui="{ base: 'justify-end' }">
          <template #after>
            <ui-auth />

            <!-- <u-button
          href="https://github.com/domutala/worcable"
          target="_blank"
          size="lg"
          color="neutral"
          variant="ghost"
          icon="i-simple-icons-github"
        >
        </u-button> -->
          </template>
        </ui-menu-horizontal-items>
      </header>
    </template>

    <UMain>
      <slot />
    </UMain>

    <u-footer>
      <template #left>
        <ThemePicker />

        <div class="flex flex-col gap-1">
          <u-link :to="$localePath({ name: 'index' })">
            <ui-logo shortable />
          </u-link>

          <p class="text-sm mt-2">
            <span class="text-muted"> powered by </span>

            <u-link
              to="https://worcable.netlify.app"
              target="_blank"
              class="underline text-default"
            >
              Worcable
            </u-link>
          </p>

          <p class="text-muted text-sm">© {{ new Date().getFullYear() }}</p>
        </div>
      </template>
    </u-footer>
  </ui-layout>
</template>
