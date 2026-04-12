<script lang="ts" setup>
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

defineProps<{ shortable?: boolean }>();

const breakpoints = useBreakpoints(breakpointsTailwind);
const flip = breakpoints.smallerOrEqual("lg");
</script>

<template>
  <div class="flex items-center gap-2 group/logo select-none">
    <ui-logo-icon class="size-8.5" />
    <ui-logo-text class="text-[26px]" />
  </div>
</template>
