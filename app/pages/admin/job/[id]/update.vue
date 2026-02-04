<script lang="ts" setup>
import type { Job } from "~~/server/database/schema";

definePageMeta({ layout: false });
const { job } = defineProps<{ job: Job }>();
</script>

<template>
  <ui-job-create :job />
</template>
