<script lang="ts" setup>
import type { Job } from "~~/server/database/schema";
import type { DropdownMenuItem } from "@nuxt/ui";
import _ from "lodash";

const { job } = defineProps<{ job: Job }>();

const items = ref<DropdownMenuItem[]>([
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
]);
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

    <ui-menu-horizontal :gap="5" :ui="{ base: 'justify-end' }">
      <UColorModeButton />

      <u-button
        v-for="(item, i) in items"
        :key="i"
        :item-index="i"
        :label="item.label"
        :icon="item.icon"
        :to="item.to"
        :target="item.target"
        size="lg"
        variant="soft"
        color="neutral"
        class="rounded- cursor-pointer"
        @click="item.onSelect"
      >
      </u-button>

      <template #after="{ itemStates, nHide }">
        <UDropdownMenu
          v-if="nHide"
          :items="items.filter((item, i) => itemStates[i] === 'hide')"
          :content="{ align: 'end' }"
          :ui="{ item: 'cursor-pointer' }"
        >
          <UButton
            size="lg"
            color="neutral"
            variant="ghost"
            class="cursor-pointer my-auto"
          >
            <u-icon name="i-lucide-text" class="size-5 rotate-z-180" />
          </UButton>
        </UDropdownMenu>
      </template>
    </ui-menu-horizontal>
  </div>
</template>
