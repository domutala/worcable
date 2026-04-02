<script setup lang="ts">
const { locale, locales: $locales, setLocale } = useI18n();

const locales = computed(() => {
  return $locales.value.map((lo) => {
    return {
      label: lo.name,
      value: lo.code,
    };
  });
});

watch(locale, () => {
  setLocale(locale.value);
});
</script>

<template>
  <USelect
    v-model="locale"
    variant="ghost"
    icon="i-lucide-globe"
    size="lg"
    class="cursor-pointer"
    trailing-icon=""
    :items="locales"
  />
</template>
