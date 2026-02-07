<script lang="ts" setup>
import type { Apply, Job } from "~~/server/database/schema";

const job = defineModel<Job>("job", { required: true });
const apply = defineModel<Apply>("apply", { required: true });
</script>

<template>
  <slot :apply :job />
</template>
