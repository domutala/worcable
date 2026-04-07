<script lang="ts" setup>
import { omit } from "@nuxt/ui/utils";

const props = defineProps<{
  ui?: Partial<{ content: string; border?: string }>;
}>();
const slots = defineSlots();
const getProxySlots = () => omit(slots, ["default"]);
</script>

<template>
  <ui-layout-content v-bind="props">
    <template v-for="(_, name) in getProxySlots()" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>

    <div class="sticky top-0 z-100 backdrop-blur-3xl">
      <slot name="header" />

      <div
        class="relative h-0.5 w-full bg-linear-to-l from-transparent to-primary/30 border-b-0!"
        :class="ui?.border"
      ></div>
    </div>
    <slot />
  </ui-layout-content>
</template>
