<script lang="ts" setup>
import type { Job } from "~~/server/database/schema";
import type { DropdownMenuItem } from "@nuxt/ui";
import _ from "lodash";

const { job } = defineProps<{ job: Job }>();

const items = ref<DropdownMenuItem[][]>([
  [
    {
      label: Use.i18n.t("job.actions.update"),
      icon: "i-lucide-pencil-line",
      to: Use.localePath({
        name: "admin-job-id-update",
        params: { id: job.id },
      }),
    },
    {
      label: "Settings",
      icon: "i-lucide-cog",
      kbds: [","],
    },
    {
      label: "Keyboard shortcuts",
      icon: "i-lucide-monitor",
    },
  ],
  [
    {
      label: "Team",
      icon: "i-lucide-users",
    },
    {
      label: "Invite users",
      icon: "i-lucide-user-plus",
      children: [
        [
          {
            label: "Email",
            icon: "i-lucide-mail",
          },
          {
            label: "Message",
            icon: "i-lucide-message-square",
          },
        ],
        [
          {
            label: "More",
            icon: "i-lucide-circle-plus",
          },
        ],
      ],
    },
    {
      label: "New team",
      icon: "i-lucide-plus",
      kbds: ["meta", "n"],
    },
  ],
  [
    {
      label: "GitHub",
      icon: "i-simple-icons-github",
      to: "https://github.com/nuxt/ui",
      target: "_blank",
    },
    {
      label: "Support",
      icon: "i-lucide-life-buoy",
      to: "/docs/components/dropdown-menu",
    },
    {
      label: "API",
      icon: "i-lucide-cloud",
      disabled: true,
    },
  ],
  [
    {
      label: "Logout",
      icon: "i-lucide-log-out",
      kbds: ["shift", "meta", "q"],
    },
  ],
]);
</script>

<template>
  <div class="py-3 px-5 flex bg-default backdrop-blur-xl">
    <div class="leading-none">
      <h1 class="text-xl font-bold">
        {{ job.title }}
      </h1>
      <div>
        {{ job.location }}
      </div>
    </div>

    <div class="mx-auto"></div>

    <div class="flex items-center">
      <UDropdownMenu :items="items" :content="{ align: 'end' }">
        <UButton
          icon="i-lucide-menu"
          color="neutral"
          variant="outline"
          class="cursor-pointer"
        />
      </UDropdownMenu>
    </div>
  </div>
</template>
