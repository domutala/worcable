<script lang="ts" setup>
import type { Apply, Job } from "~~/server/database/schema";
import type { IDataResult } from "~~/server/interfaces";

const { job } = defineProps<{ job: Job }>();
const { data, status, refresh } = await useFetch<IDataResult<Apply>>(
  `/api/admin/job/${job.id}/applys`,
);

const candidates = computed(() => {
  if (!data.value) return [];

  return data.value.items
    .map((apply) => {
      return {
        src: apply.data.avatar
          ? `/api/file/${apply.data.avatar?.data}`
          : undefined,
        alt: `${apply.data.firstName} ${apply.data.lastName}`,
      };
    })
    .slice(0, 3);
});
</script>

<template>
  <UAvatarGroup
    v-if="candidates.length"
    :ui="{ base: 'bg-accented rounded-[inherit]' }"
    class="p-2 py-2"
  >
    <UAvatar
      v-for="(candidate, c) in candidates"
      :key="c"
      v-bind="candidate"
      class="text-sm"
    />
    <UAvatar v-if="data && data.total > 3">
      <span class="opacity-50">+{{ data.total - 3 }} </span>
    </UAvatar>
  </UAvatarGroup>
</template>
