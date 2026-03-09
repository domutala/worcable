<script lang="ts" setup>
import type { Job } from "~~/server/database/collections/types";
const { job0 } = defineProps<{ job0: Job }>();
// if (error.value) throw createError(getServerErrorData(error.value));

const { uid } = useModal({ alias: "job-user-add" });

const { job, loading, ready } = useJob(Use.route.params.id as string, {
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
    <ui-job-user-add :job-id="job.id" :uid />
  </template>
</template>
