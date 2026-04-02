<script lang="ts" setup>
definePageMeta({ layout: "job" });
const jobID = Use.route.params.id as string;
const { job } = useJob(jobID);
</script>

<template>
  <template v-if="job">
    <ui-job-user-add :job-id="jobID" :modal="{ alias: job.id }" />
    <nuxt-page v-model:id="jobID" :job />
  </template>
</template>
