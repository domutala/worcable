// store.ts
import type { DropdownMenuItem } from "@nuxt/ui";

export function useSort({
  orderBy,
  onSort,
}: {
  orderBy: Record<string, { label: string }>;
  onSort?: () => void;
}) {
  const sortBy = ref<string>("updatedAt");
  const sortOrder = ref<string>("desc");

  watch(
    () => sortBy.value,
    () => onSort?.(),
  );
  watch(
    () => sortOrder.value,
    () => onSort?.(),
  );

  const items = computed(() => {
    const items: DropdownMenuItem[] = [
      ...Object.keys(orderBy).map((key) => {
        return {
          label: orderBy[key]?.label,
          checked: true, // sortBy?.value === key,
          class: "cursor-pointer",
          onSelect() {
            sortBy.value = key;
          },
        };
      }),

      { type: "separator" },

      {
        label: Use.i18n.t("order.asc"),
        icon: "i-lucide-arrow-up-narrow-wide",
        checked: sortOrder.value === "asc",
        class: "cursor-pointer",

        onSelect(e) {
          sortOrder.value = "asc";
        },
      },
      {
        label: Use.i18n.t("order.desc"),
        icon: "i-lucide-arrow-down-wide-narrow",
        checked: sortOrder.value === "desc",
        class: "cursor-pointer",
        onSelect(e) {
          sortOrder.value = "desc";
        },
      },
    ];

    return items;
  });

  const icon = computed(() => {
    return sortOrder.value === "desc"
      ? "i-lucide-arrow-down-wide-narrow"
      : "i-lucide-arrow-up-narrow-wide";
  });

  const label = computed(() => {
    return orderBy[sortBy.value]?.label as string;
  });

  const itemsDropdown = computed(() => {
    const item: DropdownMenuItem = {
      label: label.value,
      icon: icon.value,
      class: "cursor-pointer",
      children: items.value,
    };

    return item;
  });

  return { sortBy, sortOrder, items, itemsDropdown, icon, label };
}
