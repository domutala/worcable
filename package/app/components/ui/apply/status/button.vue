<script lang="ts" setup>
const { applyId: applyID, readonly } = defineProps<{
  applyId: string;
  readonly?: boolean;
}>();

const { status, ready } = useApply(applyID);
</script>

<template>
  <template v-if="ready">
    <template v-if="!status.canUpdate.value || readonly">
      <!-- <slot
      :color
      :label
      :icon
      :borderColor
      :bgColor
      :submiting="statusSubmiting"
    /> -->

      <u-button
        v-if="!$slots.default"
        :loading="status.loading"
        :readonly
        :style="{ backgroundColor: status.bgColor.value }"
        :icon="status.icon.value"
        color="neutral"
        variant="ghost"
        class="rounded-min relative px-4 text-highlighted py-3"
      >
        {{ status.label.value }}
      </u-button>
    </template>

    <u-dropdown-menu v-else :items="status.menuItems.value">
      <!-- <slot
        :color
        :label
        :icon
        :borderColor
        :bgColor
        :submiting="statusSubmiting"
      /> -->
      <u-button
        v-if="!$slots.default"
        :loading="status.loading"
        :style="{
          backgroundColor: status.bgColor.value,
        }"
        :icon="status.icon.value"
        color="neutral"
        variant="ghost"
        class="rounded-min relative px-4 text-highlighted py-3 cursor-pointer"
      >
        {{ status.label.value }}
      </u-button>
    </u-dropdown-menu>
  </template>
</template>
