import type { DropdownMenuItem } from "@nuxt/ui";

export function getLangItems() {
  const { locales, locale, setLocale, t: $t } = useI18n();

  const langFlags = {
    fr: "i-flag-bl-4x3",
    en: "i-flag-sh-4x3",
    es: "i-flag-es-4x3",
    ar: "i-flag-sa-1x1",
  };

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

  return items;
}

export function getLangItem() {
  const { locales, locale } = useI18n();

  const current = computed(() => {
    return locales.value.find((l) => l.code === locale.value);
  });

  const items: DropdownMenuItem = {
    label: current.value?.name,
    icon: "i-lucide-languages",
    children: getLangItems(),
  };

  return items;
}
