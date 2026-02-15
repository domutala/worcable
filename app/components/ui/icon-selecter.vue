<script lang="ts" setup>
import { icons as allIcons } from "@iconify-json/lucide";

const icons = ref(Object.keys(allIcons.icons));
const searchTerm = ref("");
const page = ref(1);
const value = defineModel<string>();

const iconFiltered = computed(() => {
  let _icons = icons.value;

  if (searchTerm.value) {
    _icons = icons.value.filter((icon) =>
      icon.replaceAll("-", "").includes(searchTerm.value),
    );
  }

  return _icons;
});

const _icons = computed(() => {
  let _icons = iconFiltered.value;

  if (searchTerm.value) {
    _icons = iconFiltered.value.filter((icon) =>
      icon.replaceAll("-", "").includes(searchTerm.value),
    );
  }

  const skip = (page.value - 1) * 100;

  return _icons.slice(skip, skip + 100);
});

watch(
  () => searchTerm.value,
  () => {
    page.value = 1;
  },
);
</script>

<template>
  <u-modal :ui="{ content: 'max-w-7xl' }">
    <slot />

    <template #title>
      <u-icon v-if="value" :name="value" class="size-6" />
    </template>

    <template #body="{ close }">
      <u-container class="">
        <div class="flex flex-wrap justify-center gap-3">
          <div
            v-for="icon in _icons"
            :key="icon"
            class="group size-25 border border-default flex items-center justify-center cursor-pointer relative shadow-current/20 hover:shadow-md rounded-xl"
            @click="
              value = `i-lucide-${icon}`;
              close();
            "
          >
            <u-icon :name="`i-lucide-${icon}`" class="size-10" />

            <div
              v-if="value === `i-lucide-${icon}`"
              class="size-5 bg-inverted flex items-center justify-center absolute top-1 right-1 rounded-full"
            >
              <u-icon name="i-lucide-check" class="text-inverted size-3" />
            </div>
          </div>
        </div>
      </u-container>
    </template>

    <template #footer>
      <UPagination
        v-model:page="page"
        :items-per-page="100"
        :total="iconFiltered.length"
        :ui="{ item: 'cursor-pointer' }"
        variant="outline"
        color="neutral"
        active-color="neutral"
        active-variant="solid"
        size="md"
        class="mx-auto"
        show-edges
      />
    </template>
  </u-modal>
</template>
