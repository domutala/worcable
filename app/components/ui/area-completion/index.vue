<script setup lang="ts">
import { refDebounced } from "@vueuse/core";

interface Area {
  id: number;
  name: string;
  iso2: string;
  iso3166_2: string;
  native: string;
  latitude: string;
  longitude: string;
  type: string;
  timezone: string;
  fullName: string;
}

const runtime = useRuntimeConfig();
const searchTerm = ref("");
const searchTermDebounced = refDebounced(searchTerm, 200);
const values = defineModel<string[]>({ default: [] });

const { data: users, status } = await useFetch(
  runtime.public.areaCompletionUrl,
  {
    params: { q: searchTermDebounced },
    transform: (data: Area[]) => {
      return data?.map((user) => ({
        label: user.fullName,
        value: String(user.id),
        icon: "i-lucide-map-pin",
      }));
    },
    lazy: true,
  },
);
</script>

<template>
  <USelectMenu
    v-model="values"
    v-model:search-term="searchTerm"
    value-key="value"
    :items="users"
    :loading="status === 'pending'"
    ignore-filter
    multiple
  >
    <template #default>
      <div v-if="values.length" class="flex flex-wrap gap-2">
        <ui-area-completion-badge
          v-for="id in values"
          :key="id"
          :id
          @remove="values = values.filter((v) => v !== id)"
        />
      </div>
    </template>
  </USelectMenu>
</template>
