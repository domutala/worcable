<script lang="ts" setup>
import type { Job } from "~~/server/database/collections";

definePageMeta({ layout: false });
const job = defineModel<Job>({ required: true });
</script>

<template>
  <ui-job-create :job />
</template>
