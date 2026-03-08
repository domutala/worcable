<script lang="ts" setup>
import type { Job } from "~~/server/database/collections/types";
const { job0 } = defineProps<{ job0: Job }>();
// if (error.value) throw createError(getServerErrorData(error.value));

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
  <nuxt-page v-else-if="job && ready" v-model:id="job.id" :job />
</template>
