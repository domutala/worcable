<script setup lang="ts">
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
const values = defineModel<string[]>({ default: [] });

const { data: users, status } = await useFetch(
  runtime.public.areaCompletionUrl,
  {
    params: { ids: values },
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
    value-key="value"
    multiple
    :items="users"
    :loading="status === 'pending'"
  >
    <template v-if="values.length" #default>
      <div v-if="!$slots.default" class="flex flex-wrap gap-2">
        <ui-area-completion-badge
          v-for="id in values"
          :key="id"
          :id
          @remove="values = values.filter((v) => v !== id)"
        />
      </div>
      <slot :values />
    </template>
  </USelectMenu>
</template>
