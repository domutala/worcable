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

const {
  items,
  sortBy: sb,
  sortOrder: so,
  icon,
  label,
  itemsDropdown,
} = useSort({ orderBy, onSort });

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
      label: i18n.t("order.asc"),
      icon: "i-lucide-arrow-up-narrow-wide",
      checked: sortOrder.value === "asc",
      slot: "checked",
      class: "cursor-pointer",

      onSelect(e) {
        sortOrder.value = "asc";
      },
    },
    {
      label: i18n.t("order.desc"),
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

watch(() => sb.value, _onSort);
watch(() => so.value, _onSort);
function _onSort() {
  sortBy.value = sb.value;
  sortOrder.value = so.value;
}
</script>

<template>
  <UDropdownMenu :items :content="{ align: 'end' }">
    <UButton
      v-if="!$slots.default"
      :trailing-icon="icon"
      :label="onlyIcon ? undefined : label"
      color="neutral"
      variant="subtle"
      class="cursor-pointer"
      aria-label="Actions dropdown"
    />

    <slot :icon="icon" :label :onlyIcon />

    <!-- <template #checked-leading="{ item }">
      <div class="w-2 h-full flex items-center my-auto">
        <div
          v-if="item.checked"
          class="size-1 bg-neutral-500 rounded-full"
        ></div>
      </div>
    </template> -->
  </UDropdownMenu>
</template>
