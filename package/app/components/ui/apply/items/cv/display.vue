<script lang="ts" setup>
import type { DocDocument } from "~~/server/database/collections";

defineProps<{ cv: DocDocument }>();
</script>

<template>
  <template v-if="!$slots.default">
    <a
      :href="Doc.getUrl(cv)"
      target="_blank"
      class="underline hover:text-primary"
    >
      {{ cv.filename }}
    </a>
  </template>
  <slot :cv />
</template>
