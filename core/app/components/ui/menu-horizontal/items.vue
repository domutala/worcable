<script lang="ts" setup>
import type { DropdownMenuItem } from "@nuxt/ui";

const { items, notDropdown } = defineProps<{
  items: (DropdownMenuItem & {
    itemIndex?: string;
    notHide?: boolean;
    alwaysHide?: boolean;
  })[];
  minToShow?: number;
  notDropdown?: boolean;
}>();

const states = ref<Record<string, "show" | "hide">>({});
const nShow = ref(0);
const nHide = ref(0);

const slots = defineSlots();

const itemSlots = computed(() => {
  const _slots: Record<string, any> = {};

  for (const key of Object.keys(slots)) {
    if (key.startsWith("item-dropdown-")) _slots[key] = slots[key];
  }

  return _slots;
});
</script>

<template>
  <ui-menu-horizontal
    v-model:states="states"
    v-model:items-show="nShow"
    v-model:items-hide="nHide"
    :min-to-show
  >
    <template #before>
      <slot name="before" />
    </template>

    <template v-for="(item, i) in items" :key="i">
      <template v-if="!$slots[`item-${item.itemIndex || i}`]">
        <u-button
          v-if="!item.children?.length"
          :item-index="item.itemIndex ?? i"
          :not-hide="item.notHide"
          :always-hide="item.alwaysHide"
          size="lg"
          v-bind="item"
          type="button"
          @click="item.onSelect"
        >
        </u-button>

        <UDropdownMenu v-else :items="item.children">
          <u-button
            :item-index="item.itemIndex ?? i"
            :not-hide="item.notHide"
            :always-hide="item.alwaysHide"
            size="lg"
            v-bind="item"
            type="button"
            @click="item.onSelect"
          >
          </u-button>
        </UDropdownMenu>
      </template>
      <slot :name="`item-${item.itemIndex || i}`" />
    </template>

    <template #after="">
      <slot name="leading" />

      <UDropdownMenu
        v-if="nHide !== 0 && !notDropdown"
        :items="items.filter((item, i) => states[i] === 'hide')"
        :content="{ align: 'end' }"
        :ui="{ item: 'cursor-pointer' }"
      >
        <template v-for="(_, name) in itemSlots" #[name]="slotData">
          <slot :name="name" v-bind="slotData" />
        </template>

        <slot name="activator" />
        <div v-if="!$slots.activator" class="flex items-center">
          <UButton
            size="lg"
            color="neutral"
            variant="ghost"
            class="cursor-pointer"
            square
          >
            <u-icon name="i-lucide-text" class="size-5 rotate-z-180" />
          </UButton>
        </div>
      </UDropdownMenu>
      <slot name="after" />
    </template>
  </ui-menu-horizontal>
</template>
