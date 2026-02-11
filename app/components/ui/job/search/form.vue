<script setup lang="ts">
import type { Job } from "~~/server/database/schema";
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import { useRouteQuery } from "@vueuse/router";

const searchQuery = useRouteQuery("q", "", { transform: String });
const schemaSearchTerms = z.object({ q: z.string().optional() });
type SchemaSearchTerms = z.output<typeof schemaSearchTerms>;
const searchTermsState = reactive<Partial<SchemaSearchTerms>>({
  q: searchQuery.value,
});

async function searchByTerms(event: FormSubmitEvent<SchemaSearchTerms>) {
  searchQuery.value = event.data.q || "";
}
</script>

<template>
  <u-form
    :state="searchTermsState"
    :schema="schemaSearchTerms"
    class="bg-surface rounded-2xl flex items-center overflow-hidden"
    @submit="searchByTerms"
  >
    <UFormField name="q" class="w-full relative block">
      <u-input
        v-model="searchTermsState.q"
        type="search"
        class="h-17 w-full outline-none"
        placeholder="Rechercher un emploi"
        :ui="{
          base: 'h-full w-full ring-0! py-0 px-7 rounded-0! bg-transparent text-lg',
        }"
      />
    </UFormField>

    <u-button
      type="submit"
      variant="ghost"
      class="h-17 border-l border-default w-17 rounded-2xl p-0 justify-center cursor-pointer"
    >
      <u-icon name="i-lucide-search" class="size-8 opacity-50" />
    </u-button>
  </u-form>
</template>
