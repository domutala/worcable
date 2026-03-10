<script lang="ts" setup>
definePageMeta({ layout: "job" });
// const { uid } = useModal({ alias: "job-user-add" });
const jobID = Use.route.params.id as string;

const { job } = useJob(jobID);
</script>

<template>
  <ui-job-user-add :job-id="jobID" :modal="{ alias: job.id }" />

  <nuxt-page v-model:id="jobID" :job />
</template>
