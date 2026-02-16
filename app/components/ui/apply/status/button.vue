<script lang="ts" setup>
import type { Apply, Job } from "~~/server/database/schema";

const { readonly } = defineProps<{ readonly?: boolean }>();
const job = defineModel<Job>("job", { required: true });
const apply = defineModel<Apply>("apply", { required: true });

const { statusDropdownItems, statusSubmiting } = useApply(job, apply);
</script>

<template>
  <ui-apply-status-display
    v-slot="{ color, label, icon, borderColor, bgColor }"
    v-model:job="job"
    v-model:status="apply.status"
  >
    <template v-if="readonly">
      <slot
        :color
        :label
        :icon
        :borderColor
        :bgColor
        :submiting="statusSubmiting"
      />

      <u-button
        v-if="!$slots.default"
        :loading="statusSubmiting"
        :readonly
        :style="{
          backgroundColor: bgColor,
          border: `1px solid ${borderColor}`,
        }"
        :icon
        color="neutral"
        variant="ghost"
        class="rounded-2xl relative px-4 text-highlighted py-3"
      >
        {{ label }}
      </u-button>
    </template>

    <u-dropdown-menu v-else :items="statusDropdownItems">
      <slot
        :color
        :label
        :icon
        :borderColor
        :bgColor
        :submiting="statusSubmiting"
      />
      <u-button
        v-if="!$slots.default"
        :loading="statusSubmiting"
        :style="{
          backgroundColor: bgColor,
          border: `1px solid ${borderColor}`,
        }"
        :icon
        color="neutral"
        variant="ghost"
        class="rounded-2xl relative px-4 text-highlighted py-3 cursor-pointer"
      >
        {{ label }}
      </u-button>
    </u-dropdown-menu>
  </ui-apply-status-display>
</template>
