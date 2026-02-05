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
  <div
    class="fixed w-full top-0 z-50 backdrop-blur-2xl bg-surface/10 px-5 py-2 border-b border-default"
  >
    <UBreadcrumb :items="items" />
  </div>
  <ui-job-create :job />
</template>
