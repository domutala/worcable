<script lang="ts" setup>
import { useRouteQuery } from "@vueuse/router";
import type { Job } from "~~/server/database/collections";

definePageMeta({ layout: false });

const { job } = defineProps<{ job: Job }>();
const apply = useTemplateRef("apply");

const isCreateOpen = useRouteQuery<string | undefined>(
  "modal-apply-create",
  undefined,
  { mode: "push" },
);
</script>

<template>
  <div class="max-w-5xl mx-auto">
    <div
      class="py-4 px-5 flex gap-5 bg-inherit/10 backdrop-blur-lg sticky w-full top-0 z-50"
    >
      <div class="leading-none flex-1 min-w-0 w-0">
        <h1 class="text-lg font-bold truncate">
          {{ job.title }}
        </h1>
        <div class="truncate opacity-50">
          {{ Utils.getDateStatus(job.createdAt) }}
        </div>
      </div>

      <div class="flex items-center ml-auto">
        <u-button
          size="xl"
          class="cursor-pointer"
          @click="isCreateOpen = job.id"
        >
          {{ $t("apply.actions.apply") }}
        </u-button>
      </div>
    </div>

    <u-container class="py-15">
      <ui-job-page :job />

      <div class="flex items-center justify-center mt-10">
        <u-button
          size="xl"
          class="cursor-pointer px-5 py-3"
          variant="solid"
          color="primary"
          @click="isCreateOpen = job.id"
        >
          {{ $t("apply.actions.apply") }}
        </u-button>
      </div>
    </u-container>

    <!-- <u-container class="py-15 max-w-6xl">
      <ui-apply-create :job />
    </u-container> -->
  </div>
</template>
