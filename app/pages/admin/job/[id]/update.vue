<script lang="ts" setup>
import type { Job } from "~~/server/database/schema";

definePageMeta({ layout: false });
const job = defineModel<Job>({ required: true });
</script>

<template>
  <UiBreadcrumb
    class="fixed! w-full"
    :breads="[
      '$home',
      '$admin',
      {
        label: job.title,
        to: Use.localePath({ name: 'admin-job-id', params: { id: job.id } }),
      },
    ]"
  />

  <ui-job-create :job />
</template>
