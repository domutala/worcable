<script lang="ts" setup>
import type { DocsCollectionItem } from "@nuxt/content";

defineProps<{ page: DocsCollectionItem }>();
const { toc } = useAppConfig();
</script>

<template>
  <div class="text-center">
    <u-icon name="i-lucide-hammer" class="size-16 opacity-50" />

    <p class="text-xl mt-5">
      Nous travaillons activement à la rédaction de cette section pour vous
      offrir les meilleures ressources possibles. Vous avez une expertise sur le
      sujet ? Votre aide est la bienvenue ! Contribuez directement à
      l'amélioration de ce guide en soumettant une Pull Request ou en partageant
      vos suggestions.
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
