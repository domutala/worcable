<script lang="ts" setup>
import type { Job } from "~~/server/database/schema";
import type { DropdownMenuItem } from "@nuxt/ui";
import _ from "lodash";

const { job } = defineProps<{ job: Job }>();

const items = ref<DropdownMenuItem[][]>([
  [
    {
      label: Use.i18n.t("job.actions.broadcast"),
      icon: "i-lucide-corner-up-right",
    },
    {
      label: Use.i18n.t("job.actions.add_new_apply"),
      icon: "i-lucide-user-round-plus",
    },
    {
      label: Use.i18n.t("job.actions.display"),
      icon: "i-lucide-file-text",
      target: "_blank",
      to: Use.localePath({ name: "job-id", params: { id: job.id } }),
    },
    {
      label: Use.i18n.t("job.actions.share_job"),
      icon: "i-lucide-send",
    },
    {
      label: Use.i18n.t("job.actions.update"),
      icon: "i-lucide-pencil-line",
      to: Use.localePath({
        name: "admin-job-id-update",
        params: { id: job.id },
      }),
    },
  ],
]);
</script>

<template>
  <div
    class="py-4 px-5 flex gap-5 bg-inherit/10 backdrop-blur-lg sticky top-0 z-50"
  >
    <div class="leading-none flex-1 min-w-0 w-0">
      <h1 class="text-lg font-bold truncate">
        {{ job.title }}
      </h1>
      <div class="truncate opacity-50">
        {{ Utils.getDateStatus(job.createdAt) }}
      </div>
    </div>

    <div class="flex items-center gap-2 ml-auto">
      <u-button
        size="lg"
        trailing-icon="i-lucide-corner-up-right"
        variant="soft"
        color="neutral"
        class="rounded- cursor-pointer"
      >
        {{ $t("job.actions.broadcast") }}
      </u-button>

      <UDropdownMenu
        :items="items"
        :content="{ align: 'end' }"
        :ui="{ item: 'cursor-pointer' }"
      >
        <UButton
          size="lg"
          icon="i-lucide-menu"
          color="neutral"
          variant="soft"
          class="cursor-pointer"
          square
        />
      </UDropdownMenu>
    </div>
  </div>
</template>
