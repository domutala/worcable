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
        checked: colorMode.preference === "light",
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
        checked: colorMode.preference === "dark",
        onUpdateChecked(checked: boolean) {
          colorMode.preference = "dark";
        },
        onSelect(e: Event) {
          e.preventDefault();
          colorMode.preference = "dark";
        },
      },
      {
        label: "System",
        icon: "i-tabler-device-desktop",
        type: "checkbox",
        checked: colorMode.preference === "system",
        onUpdateChecked(checked: boolean) {
          colorMode.preference = "system";
        },
        onSelect(e: Event) {
          e.preventDefault();
          colorMode.preference = "system";
        },
      },
    ],
  };

  return items;
}
