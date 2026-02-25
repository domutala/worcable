<script lang="ts" setup>
import type { Job } from "~~/server/database/schema";

definePageMeta({ layout: false });

const job = defineModel<Job>({ required: true });
const side = useCookie<string>(`job-side`, { default: () => "kanban" });
</script>

<template>
  <ui-layout class="h-screen">
    <template #header>
      <ui-job-header v-model:job="job" />
    </template>

    <!-- <UiBreadcrumb :breads="['$home', '$admin', { label: job.title }]">
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
    </UiBreadcrumb> -->

    <div class="flex-1 mx-auto overflow-hidden flex flex-col w-full">
      <div
        class="mt-5 mb-2 px- hidden lg:block mx-auto"
        :class="{
          'w-450 px-7': side === 'kanban',
          'w-250': side === 'list',
        }"
      >
        <div
          class="bg-surface rounded-min border border-default flex items-center overflow-hidden w-max"
        >
          <u-button
            :class="{ 'bg-default': side === 'kanban' }"
            icon="i-lucide-kanban"
            class="cursor-pointer rounded-none"
            color="neutral"
            variant="ghost"
            size="md"
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
            size="md"
            square
            @click="side = 'list'"
          >
          </u-button>
        </div>
      </div>

      <ui-apply-kanban v-if="side === 'kanban'" v-model:job="job" />
      <ui-apply-list v-else v-model:job="job" />
    </div>
  </ui-layout>
</template>
