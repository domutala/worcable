<script lang="ts" setup>
import type { DropdownMenuItem } from "@nuxt/ui";
import { getThemeItems } from "~/tools/theme";

const items = computed(() => {
  const items: DropdownMenuItem[][] = [
    [
      {
        label: Use.i18n.t("job.actions.update"),
        icon: "i-lucide-pencil-line",
      },
      {
        label: "Settings",
        icon: "i-lucide-cog",
        kbds: [","],
      },
      {
        label: "Keyboard shortcuts",
        icon: "i-lucide-monitor",
      },
    ],
    [
      {
        label: "Team",
        icon: "i-lucide-users",
      },
      {
        label: "Invite users",
        icon: "i-lucide-user-plus",
        children: [
          [
            {
              label: "Email",
              icon: "i-lucide-mail",
            },
            {
              label: "Message",
              icon: "i-lucide-message-square",
            },
          ],
          [
            {
              label: "More",
              icon: "i-lucide-circle-plus",
            },
          ],
        ],
      },
      {
        label: Use.i18n.t("config.actions.update"),
        icon: "i-lucide-folder-pen",
        to: Use.localePath({ name: "admin-config" }),
      },
    ],
    [
      {
        label: "GitHub",
        icon: "i-simple-icons-github",
        to: "https://github.com/nuxt/ui",
        target: "_blank",
      },
      {
        label: "Support",
        icon: "i-lucide-life-buoy",
        to: "/docs/components/dropdown-menu",
      },
      {
        label: "API",
        icon: "i-lucide-cloud",
        disabled: true,
      },
    ],
    [
      getThemeItems(),
      {
        label: "Logout",
        icon: "i-lucide-log-out",
        loading: Store.session.logouting,
        onSelect(e) {
          e.preventDefault();
          Store.session.logout();
        },
      },
    ],
  ];

  return items;
});
</script>

<template>
  <u-dropdown-menu
    v-if="Store.session.user"
    :ui="{ item: 'cursor-pointer' }"
    :content="{ align: 'end' }"
    :items
  >
    <span class="cursor-pointer">
      <UAvatar
        :src="Utils.getFileUrl(Store.session.user.avatar)"
        :alt="`${Store.session.user.firstName} ${Store.session.user.lastName}`"
        size="xl"
        class="rounded-2xl"
        :chip="{ inset: true, position: 'bottom-right' }"
      />
    </span>
  </u-dropdown-menu>
</template>
