<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

const props = defineProps<{ olds?: string[] }>();
const slots = useSlots();

const UDrawer = resolveComponent("UDrawer");
const UModal = resolveComponent("UModal");

const breakpoints = useBreakpoints(breakpointsTailwind);
const smAndLess = breakpoints.smallerOrEqual("md");
const usedOverlay = computed(() => {
  if (smAndLess.value) return "drawer";
  return "modal";
});

const open = defineModel<boolean>("open", { default: false });
</script>

<template>
  <u-drawer v-if="usedOverlay === 'drawer'" v-model:open="open">
    <template
      v-for="(_, slotName) in slots"
      :key="slotName"
      #[slotName]="slotProps"
    >
      <template v-if="slotName">
        <slot :name="slotName" v-bind="slotProps" />
      </template>
      <!-- <slot :name="slotName" v-bind="slotProps" /> -->
    </template>
  </u-drawer>
  <u-modal v-else v-model:open="open">
    <template
      v-for="(_, slotName) in slots"
      :key="slotName"
      #[slotName]="slotProps"
    >
      <template v-if="slotName">
        <slot :name="slotName" v-bind="slotProps" />
      </template>
      <!-- <slot :name="slotName" v-bind="slotProps" /> -->
    </template>
  </u-modal>
</template>
