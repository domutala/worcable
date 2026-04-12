<script lang="ts" setup>
import { availability } from "~~/server/shared/apply_data/items/availability";

const state = defineModel<{ availability?: string }>({ required: true });
</script>

<template>
  <UFormField
    :label="$t('apply.items.availability.label')"
    name="availability"
    required
  >
    <URadioGroup
      v-model="state.availability"
      variant="card"
      :ui="{ item: 'bg-default', fieldset: 'flex-row flex-wrap gap-1' }"
      :items="
        availability.map((c) => ({
          label: $t(`apply.items.availability.items.${c}`),
          value: c,
        }))
      "
    />
  </UFormField>
</template>
