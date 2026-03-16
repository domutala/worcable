<script lang="ts" setup>
const { jobId: jobID } = defineProps<{ jobId: string }>();
const { job, menu, ready } = useJob(jobID);
const side = useCookie<string>(`job-side`, { default: () => "kanban" });
</script>

<template>
  <div v-if="ready" class="relative">
    <div
      class="py-3 pl-3 pr-5 hidden lg:flex items-center gap-2 bg-inherit/10 backdrop-blur-lg sticky top-0 z-50"
    >
      <div class="leading-none flex-1 min-w-0 w-0">
        <h1 class="text-lg font-semibold truncate leading-none">
          {{ job.title }}
        </h1>
        <div class="truncate opacity-50 text-sm leading-none">
          {{ Utils.getDateStatus(job.createdAt) }}
        </div>
      </div>

      <ui-menu-horizontal-items
        :items="menu.items.value"
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

      <u-dropdown-menu :items="menu.items.value">
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
