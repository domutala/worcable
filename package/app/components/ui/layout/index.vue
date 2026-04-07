<script lang="ts" setup>
import { omit } from "@nuxt/ui/utils";

const slots = defineSlots();
const getProxySlots = () => omit(slots, []);
</script>

<template>
  <div class="flex flex-col h-screen relative">
    <ui-layout-content>
      <template v-for="(_, name) in getProxySlots()" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>
    </ui-layout-content>
  </div>
</template>
