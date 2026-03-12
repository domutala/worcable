<script lang="ts" setup>
import type { FileDocument } from "~~/server/database/collections";

defineProps<{ cv: FileDocument }>();
</script>

<template>
  <template v-if="!$slots.default">
    <a
      :href="Utils.getFileUrl(cv)"
      target="_blank"
      class="underline hover:text-primary"
    >
      {{ cv.filename }}
    </a>
  </template>
  <slot :cv />
</template>
