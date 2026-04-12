<script lang="ts" setup>
import { icons as allIcons } from "@iconify-json/lucide";
import { useClipboard } from "@vueuse/core";

const icons = ref(Object.keys(allIcons.icons));
const searchTerm = ref("");
const page = ref(1);
const { text, copy, copied, isSupported } = useClipboard();

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
  <u-container class="">
    <div class="flex flex-col min-h-screen">
      <div class="py-5">
        <u-input v-model="searchTerm" class="mb-3" placeholder="Rechercher" />
      </div>

      <div class="flex flex-wrap gap-3">
        <div
          v-for="icon in _icons"
          :key="icon"
          class="group size-20 border border-default flex items-center justify-center cursor-pointer relative shadow-current/20 hover:shadow-md"
          @click="copy(`i-lucide-${icon}`)"
          @dblclick="copy(`<u-icon name='i-lucide-${icon}' />`)"
        >
          <u-icon :name="`i-lucide-${icon}`" class="size-10" />

          <div
            class="text-xs text-nowrap absolute py-1 p-2 z-5 rounded-2xl bg-default border border-default hidden group-hover:flex items-center justify-center gap-1 bottom-0 right-1/2 translate-x-1/2 translate-y-1/2"
          >
            <template v-if="copied && text.includes(`i-lucide-${icon}`)">
              <u-icon name="i-lucide-clipboard-check" />
              <div class="text-xs">Copied</div>
            </template>

            <template v-else>
              {{ icon }}
            </template>
          </div>
        </div>
      </div>

      <div class="mt-auto py-5 flex justify-center">
        <UPagination
          v-model:page="page"
          :items-per-page="100"
          :total="iconFiltered.length"
          :ui="{ item: 'cursor-pointer' }"
          variant="outline"
          color="neutral"
          active-color="neutral"
          active-variant="solid"
          size="xl"
          class="mx-auto"
          show-edges
        />
      </div>
    </div>
  </u-container>
</template>
