<script lang="ts" setup>
import type { DropdownMenuItem } from "@nuxt/ui";

const { locale } = useI18n();

const items = computed(() => {
  const items: DropdownMenuItem[] = [];

  if (Store.session.user?.role === "admin") {
    items.push({
      label: Use.i18n.t("job.actions.new"),
      icon: "i-lucide-plus",
      to: Use.localePath({ name: "admin-job-new" }),
      color: "primary",
      variant: "solid",
    });
  }

  items.push({
    icon: "i-lucide-bell-dot",
    square: true,
    notHide: true,
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
    v-else-if="$route.path.startsWith(`/${locale}/admin`)"
    :items
    :gap="5"
    :ui="{ base: 'justify-end' }"
  >
    <template #activator>
      <span class="cursor-pointer">
        <UAvatar
          :src="Doc.getUrl(Store.session.user.avatar)"
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
</template>
