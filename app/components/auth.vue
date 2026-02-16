<script lang="ts" setup>
import type { DropdownMenuItem } from "@nuxt/ui";
import { getThemeItems } from "~/tools/theme";

const itemsdd = computed(() => {
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

const teamsMenu: DropdownMenuItem[] = [
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
];

const itemStates = ref<Record<string, "show" | "hide">>({});
const nShow = ref(0);

const items = computed(() => {
  const items: DropdownMenuItem[][] = [
    [{ slot: "auth", type: "label", class: "cursor-default" }],
  ];

  if (!nShow.value || itemStates.value.cvtheque === "hide") {
    items.push([
      {
        label: "CVThèque",
        icon: "i-lucide-newspaper",
      },
    ]);
  }

  if (!nShow.value || itemStates.value.team === "hide") {
    items.push(teamsMenu);
  }

  items.push([
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
  ]);

  return items;
});
</script>

<template>
  <ui-menu-horizontal
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
  </ui-menu-horizontal>
</template>
