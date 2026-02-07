<script lang="ts" setup>
import type { BreadcrumbItem } from "@nuxt/ui";

definePageMeta({ layout: false });

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
    label: Use.i18n.t("job.labels.new"),
  },
]);
</script>

<template>
  <UiBreadcrumb
    class="fixed! w-full"
    :breads="['$home', '$admin', { label: $t('job.labels.new') }]"
  />

  <ui-job-create />
</template>
