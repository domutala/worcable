<script lang="ts" setup>
defineProps<{ shortable?: boolean }>();
</script>

<template>
  <div
    class="flex items-center gap-1.5 group"
    :class="{ shortable: shortable }"
  >
    <u-icon name="i-simple-icons-okta" class="size-8 text-primary" />

    <div
      class="font-black text-[30px] select-none bg-linear-to-r from-white to-primary text-primary bg-clip-text flex items-center group-[.shortable]:hidden lg:group-[.shortable]:flex"
    >
      <span class="opacity-50 uppercase">Wor</span>
      <span class="uppercase">cable</span>
    </div>
    <!-- <div class="font-black text-[30px] select-none">
      <span class="opacity-50 uppercase">Wor</span>
      <span class="uppercase">cable</span>
    </div> -->
  </div>
</template>
