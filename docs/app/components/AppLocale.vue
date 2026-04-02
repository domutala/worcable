<script setup lang="ts">
const { locale, locales: $locales, setLocale } = useI18n();

const locales = computed(() => {
  return $locales.value.map((lo) => {
    return {
      label: lo.name,
      value: lo.code,
      onSelect() {
        setLocale(lo.code);
      },
    };
  });
});
</script>

<template>
  <USelect
    variant="ghost"
    icon="i-lucide-globe"
    size="lg"
    class="cursor-pointer"
    trailing-icon=""
    :items="locales"
    :model-value="locale"
    :ui="{ item: 'cursor-pointer' }"
  />
</template>
