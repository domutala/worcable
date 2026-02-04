<script lang="ts" setup>
import type { DropdownMenuItem } from "@nuxt/ui";

const { orderBy, onSort, onlyIcon } = defineProps<{
  orderBy: Record<string, { label: string }>;
  onSort?: () => void;
  onlyIcon?: boolean;
}>();
const i18n = useI18n();
const UDropdownMenu = resolveComponent("UDropdownMenu");

const sortBy = defineModel<string>("sortBy", { default: "updatedAt" });
const sortOrder = defineModel<string>("sortOrder", { default: "desc" });

const sortItems = computed(() => {
  const items: DropdownMenuItem[] = [
    ...Object.keys(orderBy).map((key) => {
      return {
        label: orderBy[key]?.label,
        checked: sortBy.value === key,
        slot: "checked",
        class: "cursor-pointer",
        onSelect() {
          sortBy.value = key;
        },
      };
    }),

    {
      type: "separator",
    },

    {
      label: i18n.t("table.sort.order.asc"),
      icon: "i-lucide-arrow-up-narrow-wide",
      checked: sortOrder.value === "asc",
      slot: "checked",
      class: "cursor-pointer",

      onSelect(e) {
        sortOrder.value = "asc";
      },
    },
    {
      label: i18n.t("table.sort.order.desc"),
      icon: "i-lucide-arrow-down-wide-narrow",
      checked: sortOrder.value === "desc",
      slot: "checked",
      class: "cursor-pointer",
      onSelect(e) {
        sortOrder.value = "desc";
      },
    },
  ];

  return items;
});

watch(() => sortBy.value, _onSort);
watch(() => sortOrder.value, _onSort);
function _onSort() {
  onSort?.();
}
</script>

<template>
  <UDropdownMenu :items="sortItems" :content="{ align: 'end' }">
    <UButton
      v-if="!$slots.default"
      :trailing-icon="
        sortOrder === 'desc'
          ? 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-narrow-wide'
      "
      :label="onlyIcon ? undefined : orderBy[sortBy]?.label"
      color="neutral"
      variant="subtle"
      class="cursor-pointer"
      aria-label="Actions dropdown"
    />

    <slot
      :icon="
        sortOrder === 'desc'
          ? 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-narrow-wide'
      "
      :label="orderBy[sortBy]?.label"
      :onlyIcon
    />

    <template #checked-leading="{ item }">
      <div class="w-2 h-full flex items-center my-auto">
        <div
          v-if="item.checked"
          class="size-1 bg-neutral-500 rounded-full"
        ></div>
      </div>
    </template>
  </UDropdownMenu>
</template>
