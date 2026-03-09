<script lang="ts" setup>
const { job, loading, ready } = useJob(Use.route.params.id as string, {
  force: true,

  onReady() {
    if (!job.value) {
      throw createError({
        status: 404,
        statusText: Use.i18n.t("job.errors.job_not_found"),
      });
    }
  },
});
</script>

<template>
  <ui-layout class="h-screen">
    <template v-if="job" #header>
      <ui-job-header :job-id="job.id" />
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

    <div
      v-if="loading"
      class="flex-1 overflow-hidden flex items-center justify-center w-full"
    >
      <u-icon
        name="i-lucide-loader-circle"
        class="animate-spin size-10 text-primary"
      />
    </div>

    <slot v-else-if="job" />
  </ui-layout>
</template>
