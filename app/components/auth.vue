<script lang="ts" setup>
import type { DropdownMenuItem } from "@nuxt/ui";
import { getThemeItems } from "~/tools/theme";

const items = computed(() => {
  const items: DropdownMenuItem[] = [
    // { slot: "auth", type: "label", class: "cursor-default" },
    {
      label: Use.i18n.t("job.actions.new"),
      icon: "i-lucide-plus",
      variant: "solid",
      color: "primary",
      size: "lg",
      class: "cursor-pointer",
      to: Use.localePath({ name: "admin-job-new" }),
    },

    {
      label: "Team",
      icon: "i-lucide-users",
      variant: "soft",
      color: "neutral",
      size: "lg",
      class: "cursor-pointer",
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
      variant: "soft",
      color: "neutral",
      size: "lg",
      class: "cursor-pointer",
    },

    {
      icon: "i-lucide-bell-dot",
      variant: "soft",
      color: "neutral",
      size: "lg",
      class: "cursor-pointer",
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
    variant: "soft",
    color: "neutral",
    size: "lg",
    alwaysHide: true,
    class: "cursor-pointer",
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

  <!-- <ui-menu-horizontal
    v-if="Store.session.user"
    v-model:states="itemStates"
    v-model:n-show="nShow"
    :ui="{ base: 'justify-end' }"
    :gap="10"
  >
    <template v-if="$route.path.startsWith('/admin')">
      <u-button
        item-index="cvtheque"
        icon="i-lucide-newspaper"
        size="xl"
        color="neutral"
        variant="ghost"
        class="cursor-pointer"
      >
        CVThèque
      </u-button>

      <u-dropdown-menu :items="teamsMenu" :content="{ align: 'end' }" arrow>
        <u-button
          item-index="team"
          icon="i-lucide-users-round"
          size="xl"
          color="neutral"
          variant="ghost"
          class="cursor-pointer"
        >
          team
        </u-button>
      </u-dropdown-menu>
    </template>

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

    <template v-if="$route.path.startsWith('/admin')" #after>
      <u-button
        item-index="notification"
        icon="i-lucide-bell-dot"
        size="xl"
        color="neutral"
        variant="ghost"
      ></u-button>

      <u-dropdown-menu
        :ui="{ item: 'cursor-pointer' }"
        :content="{ align: 'end' }"
        :items
        arrow
      >
        <template #auth>
          <div
            class="p-5 flex items-center gap-3 text-left text-lg w-75 max-w-full"
          >
            <UAvatar
              :src="Utils.getFileUrl(Store.session.user.avatar)"
              :alt="`${Store.session.user.firstName} ${Store.session.user.lastName}`"
              size="3xl"
              class="rounded-2xl text-sm"
            />

            <div class="leading-none">
              <div>
                {{ Store.session.user.firstName }}
                {{ Store.session.user.lastName }}
              </div>

              <div class="text-sm opacity-50">
                {{ Store.session.user.email }}
              </div>
            </div>
          </div>
        </template>

        <span class="cursor-pointer">
          <UAvatar
            :src="Utils.getFileUrl(Store.session.user.avatar)"
            :alt="`${Store.session.user.firstName} ${Store.session.user.lastName}`"
            size="xl"
            class="rounded-xl text-sm bg-surface"
          />
        </span>
      </u-dropdown-menu>
    </template>
  </ui-menu-horizontal> -->
</template>
