import type { DropdownMenuItem } from "@nuxt/ui";

export function getThemeItems() {
  const colorMode = useColorMode();
  const appConfig = useAppConfig();

  const colors = [
    "red",
    "orange",
    "amber",
    "yellow",
    "lime",
    "green",
    "emerald",
    "teal",
    "cyan",
    "sky",
    "blue",
    "indigo",
    "violet",
    "purple",
    "fuchsia",
    "pink",
    "rose",
  ];
  const neutrals = ["slate", "gray", "zinc", "neutral", "stone"];

  const items: DropdownMenuItem[] = [
    {
      icon: "i-lucide-palette",
      label: "Primary",
      slot: "chip",
      chip: appConfig.ui.colors.primary,
      content: {
        align: "center",
        collisionPadding: 16,
      },
      children: colors.map((color) => ({
        label: color,
        chip: color,
        slot: "chip",
        checked: appConfig.ui.colors.primary === color,
        type: "checkbox",
        onSelect: (e) => {
          e.preventDefault();

          appConfig.ui.colors.primary = color;
        },
      })),
    },

    {
      icon: "i-lucide-paintbrush",
      label: "Neutral",
      slot: "chip",
      chip:
        appConfig.ui.colors.neutral === "neutral"
          ? "old-neutral"
          : appConfig.ui.colors.neutral,
      content: {
        align: "end",
        collisionPadding: 16,
      },
      children: neutrals.map((color) => ({
        label: color,
        chip: color === "neutral" ? "old-neutral" : color,
        slot: "chip",
        type: "checkbox",
        checked: appConfig.ui.colors.neutral === color,
        onSelect: (e) => {
          e.preventDefault();

          appConfig.ui.colors.neutral = color;
        },
      })),
    },

    {
      label: "Appearance",
      icon: "i-lucide-sun-moon",
      children: [
        {
          label: "Light",
          icon: "i-lucide-sun",
          type: "checkbox",
          checked: colorMode.value === "light",
          onSelect(e: Event) {
            e.preventDefault();

            colorMode.preference = "light";
          },
        },
        {
          label: "Dark",
          icon: "i-lucide-moon",
          type: "checkbox",
          checked: colorMode.value === "dark",
          onUpdateChecked(checked: boolean) {
            if (checked) {
              colorMode.preference = "dark";
            }
          },
          onSelect(e: Event) {
            e.preventDefault();
          },
        },
      ],
    },
  ];

  return items;
}
