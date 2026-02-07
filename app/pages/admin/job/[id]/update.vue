<script lang="ts" setup>
import type { BreadcrumbItem } from "@nuxt/ui";
import type { Job } from "~~/server/database/schema";

definePageMeta({ layout: false });
const { job } = defineProps<{ job: Job }>();

const items = ref<BreadcrumbItem[]>([
  {
    icon: "i-lucide-home",
    to: Use.localePath({ name: "index" }),
  },
  {
    label: Use.i18n.t("job.labels.title"),
    icon: "i-lucide-briefcase-business",
    to: Use.localePath({ name: "admin" }),
  },
  {
    label: job.title,
    to: Use.localePath({ name: "admin-job-id", params: { id: job.id } }),
  },
]);
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
