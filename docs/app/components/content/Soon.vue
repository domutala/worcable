<script lang="ts" setup>
import type { DocsEnCollectionItem } from "@nuxt/content";

defineProps<{ page: DocsEnCollectionItem }>();
const { toc } = useAppConfig();
</script>

<template>
  <div class="text-center">
    <u-icon name="i-lucide-hammer" class="size-16 opacity-30" />

    <p class="text-xl mt-5">
      {{ $t("content.soon.text") }}
    </p>

    <u-button
      v-if="page"
      class="mt-10 py-3 px-3 rounded-xl"
      color="neutral"
      variant="soft"
      target="_blank"
      icon="i-lucide-pen"
      :to="`${toc.bottom.edit}/${page.stem}.${page.extension}`"
    >
      Contribuer
    </u-button>
  </div>
</template>
