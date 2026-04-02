<script lang="ts" setup>
import type { Job } from "~~/server/database/collections";
import UiAuth from "~/components/auth.vue";

definePageMeta({ layout: false });

const { job } = defineProps<{ job: Job }>();
const { value: isCreateOpen } = useModal({ uid: "appy-for" });
</script>

<template>
  <ui-layout>
    <template #header>
      <div
        class="h-17 px-5 flex items-center gap-5 bg-inherit/10 backdrop-blur-lg sticky w-full top-0 z-50"
      >
        <div class="leading-[1.1] flex-1 min-w-0 w-0">
          <h1 class="leading-[1.1] text-lg font-bold truncate">
            {{ job.title }}
          </h1>
          <div class="truncate opacity-50 text-sm">
            {{ Utils.getDateStatus(job.createdAt) }}
          </div>
        </div>

        <div class="flex items-center gap-2 ml-auto">
          <ui-auth />

          <u-button
            size="lg"
            variant="solid"
            color="primary"
            @click="isCreateOpen = job.id"
          >
            {{ $t("apply.actions.apply") }}
          </u-button>
        </div>
      </div>
    </template>

    <u-container class="py-5 lg:py-25 max-w-4xl">
      <ui-job-page :job />
    </u-container>
  </ui-layout>
</template>
