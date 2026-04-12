// store.ts
import type { DropdownMenuItem } from "@nuxt/ui";
import { createGlobalState } from "@vueuse/core";
import { shallowRef } from "vue";

export const useLang = createGlobalState(() => {
  const { locales, locale, setLocale, t: $t } = useI18n();

  const langFlags = {
    fr: "i-flag-bl-4x3",
    en: "i-flag-sh-4x3",
    es: "i-flag-es-4x3",
    ar: "i-flag-sa-1x1",
  };

  const _locale = computed(() => {
    return locales.value.find((l) => l.code === locale.value);
  });

  const items: DropdownMenuItem[] = [
    ...locales.value.map((l) => ({
      label: l.name,
      icon: langFlags[l.code],
      checked: locale.value === l.code,
      class: "cursor-pointer",
      onSelect(e: Event) {
        e.preventDefault();
        setLocale(l.code);
      },
    })),
  ];

  return { items, lang: _locale };
});
