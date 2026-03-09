<script lang="ts" setup>
const { uid } = useModal({ alias: "job-user-add" });

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
  <template v-if="loading"></template>
  <template v-else-if="job && ready">
    <nuxt-page v-model:id="job.id" :job />
    <ui-job-user-add :job-id="job.id" :modal="{ uid }" />
  </template>
</template>
