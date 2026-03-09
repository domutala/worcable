<script lang="ts" setup>
import type { DropdownMenuItem } from "@nuxt/ui";
import type { JobUser } from "~~/server/database/collections";
import { USER_ROLES } from "~~/server/services/user_shema";

const jobUser = defineModel<JobUser>("jobUser", { required: true });

const { jobUser: me } = useJob(jobUser.value.jobID.toString());
const loading = ref(false);

const items = computed(() => {
  const items: DropdownMenuItem[] = USER_ROLES.map((c) => ({
    label: Use.i18n.t(`user.items.role.items.${c}`),
    value: c,
    onSelect: () => submit(c),
  })).filter((role) => role.value !== jobUser.value.role);

  return items;
});

async function submit(role: string) {
  loading.value = true;

  try {
    jobUser.value = await Api.$fetch<JobUser>(
      `/api/admin/job/${jobUser.value.jobID}/user/role`,
      {
        method: "post",
        body: { id: jobUser.value.id, role },
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
    v-if="me.role === 'admin' && jobUser.userID !== me.userID"
    :items
  >
    <slot :loading />
    <u-button
      v-if="!$slots.default"
      :ui="{ leadingIcon: 'size-4' }"
      :loading
      icon="i-lucide-pencil"
    >
      {{ $t(`user.items.role.items.${jobUser.role}`) }}
    </u-button>
  </u-dropdown-menu>

  <template v-else>
    <slot :loading />
    <u-badge v-if="!$slots.default" variant="soft" size="lg">
      {{ $t(`user.items.role.items.${jobUser.role}`) }}
    </u-badge>
  </template>
</template>
