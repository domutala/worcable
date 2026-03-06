<script lang="ts" setup>
import type { BreadcrumbItem } from "@nuxt/ui";

const { breads } = defineProps<{
  breads?: Array<"$home" | "$admin" | BreadcrumbItem>;
}>();
</script>

<template>
  <div class="flex flex-col h-screen">
    <ui-layout-inset>
      <template #header>
        <div class="h-6 w-full relative hidden items-center px-7 text-sm">
          {{ $dayjs().format("HH:mm") }}

          <div class="mx-auto"></div>

          <u-icon name="i-lucide-battery-full" class="size-5" />
        </div>
        <!-- <UiBreadcrumb v-if="breads" :breads class="flex items-center gap-5" /> -->
        <slot name="header" />
      </template>

      <slot />
    </ui-layout-inset>
  </div>
</template>
