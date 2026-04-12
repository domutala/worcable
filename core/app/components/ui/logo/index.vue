<script setup lang="ts">
defineProps<{ shortable?: boolean }>();
</script>

<template>
  <div class="flex items-center gap-2 group/logo select-none">
    <ui-logo-icon class="size-8.5" :logo="Store.config.config.logo" />

    <ui-logo-text
      :text="Store.config.config.name"
      class="text-[24px] text-default"
    />

    <!-- <div
      v-else
      class="flex items-center gap-1 group"
      :class="{ shortable: shortable }"
    >
      <div
        class="size-10 rounded-xl bg-surface flex items-center justify-center overflow-hidden"
      >
        <img
          v-if="Store.config.config.logo"
          :src="Doc.getUrl(Store.config.config.logo)"
          class="size-full object-cover object-center"
        />
        <u-icon v-else name="i-lucide-building-2" class="size-6 text-" />
      </div>
      <div
        class="font-semibold text-2xl select-none group-[.shortable]:bg-yellow-500"
      >
        {{ Store.config.config.orgName }}
      </div>
    </div> -->
  </div>
</template>
