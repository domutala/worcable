<script lang="ts" setup>
import type { DropdownMenuItem } from "@nuxt/ui";
import { getThemeItems } from "~/tools/theme";

const teamsItem = computed(() => {
  const children: DropdownMenuItem[] = [];

  children.push({
    label: Use.i18n.t("user.labels.your_team"),
    icon: "i-lucide-users-round",
    to: Use.localePath({ name: "admin-users" }),
  });

  if (Store.session.user?.role === "admin") {
    children.push({
      label: Use.i18n.t("user.labels.invite"),
      icon: "i-lucide-user-round-plus",
      onSelect(e) {
        const { open } = useModal({ uid: "invite-user" });
        open.value = true;
      },
    });

    children.push({
      label: Use.i18n.t("config.actions.update"),
      icon: "i-lucide-folder-pen",
      to: Use.localePath({ name: "admin-config" }),
    });
  }

  const item: DropdownMenuItem = {
    label: "Team",
    icon: "i-lucide-users",
    children,
  };

  return item;
});

const items = computed(() => {
  const items: DropdownMenuItem[] = [
    {
      slot: "item-dropdown-auth",
      type: "label",
      class: "cursor-default",
      alwaysHide: true,
    },
  ];

  if (Store.session.user?.role === "admin") {
    items.push({
      label: Use.i18n.t("job.actions.new"),
      icon: "i-lucide-plus",
      to: Use.localePath({ name: "admin-job-new" }),
      color: "primary",
    });
  }

  items.push(teamsItem.value);

  items.push(
    {
      label: "CVThèque",
      icon: "i-lucide-newspaper",
    },

    {
      icon: "i-lucide-bell-dot",
      square: true,
      notHide: true,
    },
  );

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

          <div class="text-sm text-primary leading-none">
            {{ $t(`user.items.role.items.${Store.session.user.role}`) }}
            <!-- {{ Store.session.user.email }} -->
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
