<script setup lang="ts">
import type { NavigationMenuItem, DropdownMenuItem } from "@nuxt/ui";
import { getThemeItems } from "~/tools/theme";

defineProps<{ slim?: boolean }>();

const isOpen = ref(false);

const items = computed(() => {
  const items: NavigationMenuItem[][] = [];

  items.push(
    buildItems([
      {
        label: Use.i18n.t("words.home"),
        icon: "i-lucide-home",
        to: Use.localePath({ name: "admin" }),
      },
      {
        label: $t("job.labels.title"),
        to: Use.localePath({ name: "job" }),
        icon: "i-lucide-newspaper",
        target: "_blank",
      },
      {
        label: "CVThèque",
        icon: "i-lucide-library-big",
      },
      {
        icon: "i-lucide-bell-dot",
        label: "Notification",
      },
    ]),
  );

  const g2: NavigationMenuItem[] = [
    {
      label: Use.i18n.t("user.labels.users"),
      icon: "i-lucide-users-round",
      to: Use.localePath({ name: "admin-users" }),
    },
  ];

  if (Store.session.user?.role === "admin") {
    g2.push({
      label: Use.i18n.t("config.actions.update"),
      icon: "i-lucide-settings",
      to: Use.localePath({ name: "admin-config" }),
    });
  }

  items.push(buildItems(g2));

  return items;
});

const itemsUser = computed(() => {
  const items: DropdownMenuItem[] = [
    {
      slot: "item-dropdown-auth",
      type: "label",
      class: "cursor-default",
      alwaysHide: true,
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

function buildItems(items: NavigationMenuItem[]) {
  return items.map((item) => {
    item.exact = true;

    item.onSelect = (e) => {
      isOpen.value = false;
      item.onSelect?.(e);
    };

    return item;
  });
}
</script>

<template>
  <u-slideover
    v-if="Store.session.user"
    v-model:open="isOpen"
    side="left"
    :ui="{
      content: 'max-w-72',
      header: 'border-b-0 min-h-[unset] p-0 sm:px-0',
      body: 'border-b-0! p-0 sm:px-0',
      footer: 'p-0 sm:px-0',
    }"
  >
    <u-button
      variant="ghost"
      class="rounded-none size-15 flex items-center justify-center p-0 group/toggle"
      :class="{ 'size-8': slim }"
    >
      <u-icon
        name="i-lucide-sidebar-open"
        class="size-6 opacity-35 group-hover/toggle:opacity-100"
        :class="{ 'size-3': slim }"
      />
    </u-button>

    <template #header>
      <div class="p-4">
        <u-link :to="$localePath({ name: 'admin' })" @click="isOpen = false">
          <ui-logo-app shortable />
        </u-link>
      </div>
    </template>

    <template #body>
      <div class="px-5">
        <UNavigationMenu
          :items
          :ui="{ separator: 'py-1 bg-transparent' }"
          orientation="vertical"
        />
      </div>
    </template>

    <template #footer>
      <u-dropdown-menu :items="itemsUser">
        <template #item-dropdown-auth>
          <div
            class="pb-3 px-1 flex items-center gap-3 text-left text-lg w-75 max-w-full border-b border-default"
          >
            <UAvatar
              :src="Doc.getUrl(Store.session.user.avatar)"
              :alt="`${Store.session.user.firstName} ${Store.session.user.lastName}`"
              size="3xl"
              class="rounded-2xl text-sm"
            />

            <div class="font-normal leading-none">
              <div class="leading-none">
                {{ Store.session.user.firstName }}
                {{ Store.session.user.lastName }}
              </div>

              <div class="text-sm text-muted leading-none">
                {{ Store.session.user.email }}
              </div>
            </div>
          </div>
        </template>

        <div class="p-2 w-full">
          <UButton
            :avatar="{
              src: Doc.getUrl(Store.session.user.avatar),
              alt: `${Store.session.user.firstName} ${Store.session.user.lastName}`,
              loading: 'lazy',
              size: 'xl',
              class: 'rounded-xl',
            }"
            size="xl"
            color="neutral"
            variant="ghost"
            class="justify-start text-left w-full px-4 py-3 rounded-lg"
          >
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
          </UButton>
        </div>
      </u-dropdown-menu>
    </template>
  </u-slideover>
</template>
