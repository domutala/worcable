<script lang="ts" setup>
import type { Job } from "~~/server/database/collections";

definePageMeta({ layout: false });
defineProps<{ job: Job }>();
</script>

<template>
  <ui-job-create :job />
</template>
