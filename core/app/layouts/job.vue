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
  <ui-layout>
    <div
      v-if="loading"
      class="flex-1 overflow-hidden flex items-center justify-center size-full"
    >
      <u-icon
        name="i-lucide-loader-circle"
        class="animate-spin size-10 text-primary"
      />
    </div>

    <template v-else-if="job">
      <ui-job-header :job-id="job.id" />
      <slot />
    </template>
  </ui-layout>
</template>
