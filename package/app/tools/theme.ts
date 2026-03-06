import type { DropdownMenuItem } from "@nuxt/ui";

export function getThemeItems() {
  let colorMode = useColorMode();

  const items: DropdownMenuItem = {
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
          colorMode = useColorMode();
          colorMode.preference = "light";
        },
      },
      {
        label: "Dark",
        icon: "i-lucide-moon",
        type: "checkbox",
        checked: colorMode.value === "dark",
        onUpdateChecked(checked: boolean) {
          colorMode.preference = "dark";
        },
        onSelect(e: Event) {
          e.preventDefault();
          colorMode.preference = "dark";
        },
      },
    ],
  };

  return items;
}
