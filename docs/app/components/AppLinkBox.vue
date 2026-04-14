<script lang="ts" setup>
import type { RouteLocationRaw } from "vue-router";

const NuxtLink = resolveComponent("NuxtLink");

withDefaults(
  defineProps<{
    icon?: string;
    label?: string;
    to?: RouteLocationRaw;
    linkToLabel?: boolean;
  }>(),
  {
    icon: "i-lucide-arrow-right",
    linkToLabel: false,
    label() {
      const i18n = useI18n();
      return i18n.t("words.know_more");
    },
  }
);
</script>

<template>
  <component
    :is="!linkToLabel ? NuxtLink : 'div'"
    class="group/link-anime relative"
    :to
  >
    <slot />

    <component
      :is="linkToLabel ? NuxtLink : 'div'"
      :to
      class="relative flex items-center w-max"
    >
      <div
        class="whitespace-nowrap w-0 not-lg:w-full group-hover/link-anime:w-full transition-all relative h-full overflow-hidden text-primary"
      >
        <span v-if="!$slots.label">{{ label }}</span>
        <slot name="label" />
      </div>

      <u-icon v-if="!$slots.icon" :name="icon" class="text-primary" />
      <slot name="icon" />
    </component>
  </component>
</template>
