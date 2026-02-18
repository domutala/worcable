<script lang="ts" setup>
import type { Job } from "~~/server/database/schema";
import type { DropdownMenuItem } from "@nuxt/ui";
import _ from "lodash";

const job = defineModel<Job>("job", { required: true });
const uJob = useJob(job);

const items = computed(() => {
  const statusItems = uJob.statusDropdown.value;
  statusItems.variant = "soft";
  statusItems.color = "neutral";
  statusItems.notHide = true;

  const items: DropdownMenuItem[] = [
    statusItems,

    {
      label: Use.i18n.t("job.actions.add_new_apply"),
      icon: "i-lucide-user-round-plus",
      variant: "soft",
      color: "neutral",
      class: "cursor-pointer",
    },
    {
      label: Use.i18n.t("job.actions.broadcast"),
      icon: "i-lucide-corner-up-right",
      variant: "soft",
      color: "neutral",
      class: "cursor-pointer",
      onSelect(e) {
        alert("dsdfsf");
      },
    },
    {
      label: Use.i18n.t("job.actions.display"),
      icon: "i-lucide-file-text",
      target: "_blank",
      variant: "soft",
      color: "neutral",
      class: "cursor-pointer",
      to: Use.localePath({ name: "job-id", params: { id: job.value.id } }),
    },
    {
      label: Use.i18n.t("job.actions.share_job"),
      icon: "i-lucide-send",
      variant: "soft",
      color: "neutral",
      class: "cursor-pointer",
    },
    {
      label: Use.i18n.t("job.actions.update"),
      icon: "i-lucide-pencil-line",
      variant: "soft",
      color: "neutral",
      class: "cursor-pointer",
      to: Use.localePath({
        name: "admin-job-id-update",
        params: { id: job.value.id },
      }),
    },
  ];

  return items;
});
</script>

<template>
  <div
    class="py-3 px-10 flex gap-2 bg-inherit/10 backdrop-blur-lg sticky top-0 z-50"
  >
    <div class="leading-none flex-1 min-w-0 w-0">
      <h1 class="text-lg font-semibold truncate">
        {{ job.title }}
      </h1>
      <div class="truncate opacity-50">
        {{ Utils.getDateStatus(job.createdAt) }}
      </div>
    </div>

    <ui-menu-horizontal-items :items :gap="5" :ui="{ base: 'justify-end' }" />
  </div>
</template>
