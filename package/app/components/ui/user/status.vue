<script lang="ts" setup>
import type { DropdownMenuItem } from "@nuxt/ui";
import type { User } from "~~/server/database/collections";
import { USER_ROLES } from "~~/server/services/user_shema";

const user = defineModel<User>("user", { required: true });
const loading = ref(false);

const items = computed(() => {
  const items: DropdownMenuItem[] = USER_ROLES.map((c) => ({
    label: Use.i18n.t(`user.items.role.items.${c}`),
    value: c,
    onSelect: () => submit(c),
  })).filter((role) => role.value !== user.value.role);

  return items;
});

async function submit(role: string) {
  loading.value = true;

  try {
    user.value = await Api.$fetch<User>(
      `/api/admin/user/${user.value.id}/role`,
      {
        method: "post",
        body: { id: user.value.id, role },
      },
    );
  } catch (error) {
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <u-dropdown-menu
    v-if="
      Store.session.user?.role === 'admin' && user.id !== Store.session.user?.id
    "
    :items
  >
    <slot :loading />
    <u-button
      v-if="!$slots.default"
      :ui="{ leadingIcon: 'size-4' }"
      :loading
      icon="i-lucide-pencil"
    >
      {{ $t(`user.items.role.items.${user.role}`) }}
    </u-button>
  </u-dropdown-menu>

  <template v-else>
    <slot :loading />
    <u-badge v-if="!$slots.default" variant="soft" size="lg">
      {{ $t(`user.items.role.items.${user.role}`) }}
    </u-badge>
  </template>
</template>
