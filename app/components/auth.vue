<script lang="ts" setup>
import type { DropdownMenuItem } from "@nuxt/ui";
import { getThemeItems } from "~/tools/theme";

const items = computed(() => {
  const items: DropdownMenuItem[] = [
    {
      slot: "item-dropdown-auth",
      type: "label",
      class: "cursor-default",
      alwaysHide: true,
    },
    {
      label: Use.i18n.t("job.actions.new"),
      icon: "i-lucide-plus",
      to: Use.localePath({ name: "admin-job-new" }),
      color: "primary",
    },

    {
      label: "Team",
      icon: "i-lucide-users",
      children: [
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
    },

    {
      label: "CVThèque",
      icon: "i-lucide-newspaper",
    },

    {
      icon: "i-lucide-bell-dot",
      square: true,
      notHide: true,
    },
  ];

  if (!Store.config.config.colorMode) {
    items.push({
      ...getThemeItems(),
      alwaysHide: true,
      variant: "soft",
      color: "neutral",
      size: "lg",
    });
  }

  items.push({
    label: "Logout",
    icon: "i-lucide-log-out",
    loading: Store.session.logouting,
    alwaysHide: true,
    onSelect(e) {
      e.preventDefault();
      Store.session.logout();
    },
  });

  return items;
});
</script>

<template>
  <u-button
    v-if="!Store.session.user"
    :to="$localePath({ name: 'login' })"
    size="lg"
    color="neutral"
    variant="soft"
  >
    {{ $t("login.labels.title") }}
  </u-button>

  <ui-menu-horizontal-items
    v-else-if="$route.path.startsWith('/admin')"
    :items
    :gap="5"
    :ui="{ base: 'justify-end' }"
  >
    <template #activator>
      <span class="cursor-pointer">
        <UAvatar
          :src="Utils.getFileUrl(Store.session.user.avatar)"
          :alt="`${Store.session.user.firstName} ${Store.session.user.lastName}`"
          size="xl"
          class="rounded-xl text-sm bg-surface"
        />
      </span>
    </template>

    <template #item-dropdown-auth>
      <div
        class="pb-3 px-1 flex items-center gap-3 text-left text-lg w-75 max-w-full border-b border-default"
      >
        <UAvatar
          :src="Utils.getFileUrl(Store.session.user.avatar)"
          :alt="`${Store.session.user.firstName} ${Store.session.user.lastName}`"
          size="3xl"
          class="rounded-2xl text-sm"
        />

        <div class="font-normal leading-none">
          <div class="leading-none">
            {{ Store.session.user.firstName }}
            {{ Store.session.user.lastName }}
          </div>

          <div class="text-sm opacity-50 leading-none">
            {{ Store.session.user.email }}
          </div>
        </div>
      </div>
    </template>
  </ui-menu-horizontal-items>

  <u-button
    v-else
    icon="i-lucide-layout-dashboard"
    size="lg"
    color="neutral"
    variant="soft"
    :to="$localePath({ name: 'admin' })"
    :ui="{ base: '' }"
  >
    Dashboard
  </u-button>
</template>
