<script lang="ts" setup>
import type { DropdownMenuItem } from "@nuxt/ui";
import UiAuth from "~/components/auth.vue";

const items = computed(() => {
  const items: DropdownMenuItem[] = [
    {
      label: Use.i18n.t("job.actions.add_new_apply"),
      icon: "i-lucide-user-round-plus",
      variant: "ghost",
      color: "neutral",
      class: "cursor-pointer",
    },
    {
      label: $t("words.playground"),
      variant: "ghost",
      color: "neutral",
      class: "cursor-pointer",
      to: Use.localePath({ name: "jobs" }),
    },

    {
      label: Use.i18n.t("job.actions.share_job"),
      icon: "i-lucide-send",
      variant: "ghost",
      color: "neutral",
      class: "cursor-pointer",
    },
    {
      label: Use.i18n.t("job.actions.update"),
      icon: "i-lucide-pencil-line",
      variant: "ghost",
      color: "neutral",
      class: "cursor-pointer",
    },
  ];

  return items;
});
</script>

<template>
  <header
    class="sticky top-0 z-50 backdrop-blur-2xl flex items-center gap-2 px-10 py-3"
  >
    <ui-logo shortable />

    <div class="w-10 mr-auto"></div>

    <ui-menu-horizontal-items :items :gap="5" :ui="{ base: 'justify-center' }">
      <template #after>
        <ui-auth />

        <u-button
          href="https://github.com/domutala/worcable"
          target="_blank"
          size="lg"
          color="neutral"
          variant="ghost"
          icon="i-simple-icons-github"
        >
        </u-button>
      </template>
    </ui-menu-horizontal-items>
  </header>

  <slot />

  <footer class="border-t border-default">
    <u-container class="flex justify-center">
      <div class="py-30 flex mx-auto gap-20 flex-wrap">
        <div class="flex flex-col gap-4 mr-15">
          <ui-logo-app />
          <p class="text-muted text-sm">© {{ new Date().getFullYear() }}</p>
        </div>

        <div class="flex flex-col gap-4">
          <div class="text-sm opacity-50 mb-1">
            {{ $t("foot.about.title") }}
          </div>
          <nuxt-link href="https://domutala.netlify.app" target="_blank">
            @domutala
          </nuxt-link>
          <nuxt-link :to="$localePath({ name: 'contact' })">
            {{ $t("foot.about.why_open_source") }}
          </nuxt-link>
        </div>

        <div class="flex flex-col gap-4">
          <div class="text-sm opacity-50 mb-1">
            {{ $t("foot.ressources.title") }}
          </div>

          <nuxt-link
            v-for="item in [
              'Roadmap',
              'Pricing',
              'Contact support',
              'Feature Requests',
            ]"
            :key="item"
          >
            {{ item }}
          </nuxt-link>
        </div>

        <div class="flex flex-col gap-4">
          <div class="text-sm opacity-50 mb-1">
            {{ $t("foot.legal.title") }}
          </div>
          <nuxt-link>
            {{ $t("foot.legal.licence") }}
          </nuxt-link>

          <nuxt-link>
            {{ $t("foot.legal.sscurity") }}
          </nuxt-link>

          <nuxt-link>
            {{ $t("foot.legal.terms_of_service") }}
          </nuxt-link>
        </div>
      </div>
    </u-container>
  </footer>
</template>
