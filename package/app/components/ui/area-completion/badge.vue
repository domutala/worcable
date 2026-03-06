<script lang="ts" setup>
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

const { id } = defineProps<{ id: string | number }>();
const emit = defineEmits<(e: "remove", id: string | number) => void>();
const runtime = useRuntimeConfig();

const { data: area, status } = await useFetch<Area>(
  `${runtime.public.areaCompletionUrl}/${id}`,
);
</script>

<template>
  <ui-skeleton
    v-if="status === 'pending'"
    class="w-50 h-9 border border-default bg-surface/50 rounded-lg"
  />
  <u-button
    v-else-if="area"
    color="neutral"
    variant="soft"
    class="border border-default cursor-pointer"
    trailing-icon="i-lucide-x"
    @click.stop="emit('remove', id)"
  >
    {{ area.name }}
  </u-button>
</template>
