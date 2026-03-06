<script lang="ts" setup>
import { getServerErrorData } from "~/tools/onFetchError";

const {
  data: job,
  status,
  error,
} = await useFetch(`/api/admin/job/${Use.route.params.id}`);

if (error.value) throw createError(getServerErrorData(error.value));
if (!job.value) {
  throw createError({
    status: 404,
    statusText: Use.i18n.t("job.errors.job_not_found"),
  });
}
</script>

<template>
  <template v-if="status === 'pending'"></template>
  <nuxt-page v-else-if="job" :job />
</template>
