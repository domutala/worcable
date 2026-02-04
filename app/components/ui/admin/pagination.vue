<script lang="ts" setup>
const { items, onPaginate } = defineProps<{
  items: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    items: any[];
  };
  onPaginate?: () => void;
}>();
const page = defineModel<number>("page", { default: 1 });

function _onPaginate(p: number) {
  page.value = p;
  onPaginate?.();
}
</script>

<template>
  <div class="flex items-center gap-3 p-3 px-3 border-t border-default">
    <template v-if="items.items.length">
      {{ (items.page - 1) * items.pageSize + items.items.length }} sur
      {{ items.total }}
    </template>

    <div class="mx-auto"></div>
    <UPagination
      show-edges
      variant="ghost"
      color="neutral"
      active-color="neutral"
      active-variant="soft"
      size="sm"
      :page="items.page"
      :items-per-page="items.pageSize"
      :total="items.total"
      :ui="{ item: 'cursor-pointer' }"
      @update:page="_onPaginate"
    />
  </div>
</template>
