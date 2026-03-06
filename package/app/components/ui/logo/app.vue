<script lang="ts" setup>
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

defineProps<{ shortable?: boolean }>();

const breakpoints = useBreakpoints(breakpointsTailwind);
const flip = breakpoints.smallerOrEqual("lg");
</script>

<template>
  <div
    class="flex items-center gap-1.5 group"
    :class="{ shortable: shortable }"
  >
    <u-icon
      name="i-simple-icons-okta"
      class="size-8 text-primary group-[.shortable]:hidden lg:group-[.shortable]:flex"
    />

    <!-- <div
      class="font-black text-[30px] select-none bg-linear-to-r from-white to-primary text-primary bg-clip-text flex items-center group-[.shortable]:hidden lg:group-[.shortable]:flex"
    >
      <span class="opacity-50 uppercase">Wor</span>
      <span class="uppercase">cable</span>
    </div> -->

    <!-- <div class="font-black text-[20px] select-none">
      <span class="opacity-50 uppercase">Wor</span>
      <span class="uppercase">cable</span>
    </div> -->

    <div
      class="font-black text-[20px] select-none"
      :class="{
        'bg-linear-to-r from-white to-primary text-primary bg-clip-text':
          flip && shortable,
      }"
    >
      <span class="opacity-50 uppercase">Wor</span>
      <span class="uppercase">cable</span>
    </div>
  </div>
</template>
