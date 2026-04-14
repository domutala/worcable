<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const { docHomePage, repository, footer } = useAppConfig();
const { t: $t } = useI18n();
const localePath = useLocalePath();

const items = ref<NavigationMenuItem[]>([
  {
    label: $t("header.why_open_source.title"),
    to: localePath({ name: "why-open-source" }),
  },

  {
    label: $t("header.developers.title"),

    children: [
      {
        label: "Documentation",
        icon: "i-lucide-file-text",
        description: "Display a list of links.",
        to: localePath(docHomePage),
      },
      {
        label: "Pagination",
        icon: "i-lucide-file-text",
        description: "Display a list of pages.",
      },
      {
        label: "Progress",
        icon: "i-lucide-file-text",
        description: "Show a horizontal bar to indicate task progression.",
      },
      {
        label: "Link",
        icon: "i-lucide-file-text",
        description: "Use NuxtLink with superpowers.",
      },
      {
        label: "Modal",
        icon: "i-lucide-file-text",
        description: "Display a modal within your application.",
      },
      {
        label: "NavigationMenu",
        icon: "i-lucide-file-text",
        description: "Display a list of links.",
      },
      {
        label: "Progress",
        icon: "i-lucide-file-text",
        description: "Show a horizontal bar to indicate task progression.",
      },
      {
        label: "Link",
        icon: "i-lucide-file-text",
        description: "Use NuxtLink with superpowers.",
      },
      {
        label: "Modal",
        icon: "i-lucide-file-text",
        description: "Display a modal within your application.",
      },
      {
        label: "NavigationMenu",
        icon: "i-lucide-file-text",
        description: "Display a list of links.",
      },
    ],
  },

  {
    label: "Services",
    children: footer.groups["03.services"].links.map((link) => {
      link.label = $t(link.label);
      return link;
    }),
  },

  {
    label: "GitHub",
    icon: "i-simple-icons-github",
    // badge: "6k",
    to: repository,
    target: "_blank",
  },
]);
</script>

<template>
  <UNavigationMenu
    highlight
    :items
    :ui="{
      viewport: 'rounded-none ring-0 shadow-none! bg-transparent',
      viewportWrapper:
        'fixed max-w-[calc(var(--ui-app-container)-2px)] left-1/2 -translate-x-1/2 top-[calc(100%+0.5px)]',
    }"
  >
    <template #item-trailing="{ item, active }">
      <template v-if="item.children?.length">
        <u-icon
          name="i-lucide-plus"
          class="transition-all"
          :class="{ 'rotate-45': item.open }"
        />
      </template>
      <div></div>
    </template>

    <template #item-content="{ item }">
      <div
        v-if="item.children?.length"
        class="shadow-lg border-b border-default mb-10 bg-default overflow-auto flex"
      >
        <ul class="grid grid-flow-col grid-rows-6 gap-2 p-4 w-1/2">
          <li v-for="child in item.children" :key="child.label" class="w-90">
            <ULink
              class="group/link text-sm text-left rounded-md p-3 transition-colors hover:bg-elevated w-full h-full block"
              v-bind="child"
            >
              <div
                class="flex items-center gap-1 font-medium text-highlighted group-hover/link:text-primary truncate"
              >
                {{ child.label }}

                <u-icon
                  v-if="child.target === '_blank'"
                  name="i-lucide-arrow-up-right"
                  class="inline-block size-3 align-top text-dimmed"
                />

                <u-icon
                  name="i-lucide-chevron-right"
                  class="hidden group-hover/link:block animate-[enter-from-left_200ms_ease] data-[motion=to-start]:animate-[exit-to-left_200ms_ease]"
                />
              </div>
              <p class="text-muted line-clamp-2">
                {{ child.description }}
              </p>
            </ULink>
          </li>
        </ul>

        <div class="w-1/2">
          <AppLinkAnime :label="$t('words.know_more')" class="p-5 w-120 hidden">
            <img
              src="https://www.docker.com/app/uploads/2024/10/banner-docker-logo-blue-wavy-bkgd-480x252.png"
              class="w-full object-cover object-center rounded-lg"
            />

            <div class="my-3">
              <p class="line-clamp-3">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam,
                laboriosam eius officiis nostrum velit mollitia ad architecto
                temporibus quasi quos voluptatem quo voluptatibus totam
                consequatur corrupti optio perferendis placeat nobis!
              </p>
            </div>
          </AppLinkAnime>
        </div>
      </div>
    </template>
  </UNavigationMenu>
</template>
