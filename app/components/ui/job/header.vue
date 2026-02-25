<script lang="ts" setup>
import type { Job } from "~~/server/database/schema";
import type { DropdownMenuItem } from "@nuxt/ui";
import _ from "lodash";

const job = defineModel<Job>("job", { required: true });
const uJob = useJob(job);
const side = useCookie<string>(`job-side`, { default: () => "kanban" });

const items = computed(() => {
  const statusItems = uJob.statusDropdown.value;
  statusItems.variant = "soft";
  statusItems.color = "neutral";
  // statusItems.notHide = true;

  const items: DropdownMenuItem[] = [
    statusItems,

    {
      label: Use.i18n.t("job.actions.add_new_apply"),
      icon: "i-lucide-user-round-plus",
    },
    {
      label: Use.i18n.t("job.actions.broadcast"),
      icon: "i-lucide-corner-up-right",
      onSelect(e) {
        alert("dsdfsf");
      },
    },
    {
      label: Use.i18n.t("job.actions.display"),
      icon: "i-lucide-file-text",
      target: "_blank",
      to: Use.localePath({ name: "job-id", params: { id: job.value.id } }),
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
        params: { id: job.value.id },
      }),
    },
  ];

  return items;
});
</script>

<template>
  <div class="relative">
    <div
      class="py-3 pl-3 pr-5 hidden lg:flex items-center gap-2 bg-inherit/10 backdrop-blur-lg sticky top-0 z-50"
    >
      <u-button
        size="xs"
        variant="ghost"
        icon="i-lucide-arrow-left"
        square
        @click="$router.back()"
      >
      </u-button>

      <div class="leading-none flex-1 min-w-0 w-0">
        <h1 class="text-lg font-semibold truncate leading-none">
          {{ job.title }}
        </h1>
        <div class="truncate opacity-50 text-sm leading-none">
          {{ Utils.getDateStatus(job.createdAt) }}
        </div>
      </div>

      <ui-menu-horizontal-items
        :items
        :gap="5"
        :min-to-show="3"
        :ui="{ base: 'justify-end' }"
      >
        <template #activator>
          <u-button
            icon="i-lucide-ellipsis-vertical"
            class="cursor-pointer"
            color="neutral"
            variant="ghost"
            size="sm"
            square
          >
          </u-button>
        </template>
      </ui-menu-horizontal-items>
    </div>

    <div class="flex items-center gap-2 lg:hidden r py-1.5 px-3">
      <u-button
        size="xs"
        variant="ghost"
        icon="i-lucide-arrow-left"
        square
        @click="$router.back()"
      >
      </u-button>

      <div class="leading-none flex-1 min-w-0 w-0">
        <h1 class="truncate text-sm">
          {{ job.title }}
        </h1>
      </div>

      <div
        class="bg-surface rounded-md border border-default h-full flex items-center ml-auto overflow-hidden"
      >
        <u-button
          :class="{ 'bg-default': side === 'kanban' }"
          icon="i-lucide-kanban"
          class="cursor-pointer rounded-none"
          color="neutral"
          variant="ghost"
          size="sm"
          square
          @click="side = 'kanban'"
        >
        </u-button>
        <u-button
          :class="{ 'bg-default': side === 'list' }"
          icon="i-lucide-text"
          class="cursor-pointer rounded-none"
          color="neutral"
          variant="ghost"
          size="sm"
          square
          @click="side = 'list'"
        >
        </u-button>
      </div>

      <u-dropdown-menu :items>
        <u-button
          icon="i-lucide-ellipsis-vertical"
          class="cursor-pointer"
          color="neutral"
          variant="ghost"
          size="sm"
          square
        >
        </u-button>
      </u-dropdown-menu>
    </div>
  </div>
</template>
