<script lang="ts" setup>
import { educationLevel } from "~~/server/shared/apply_data/items/educationLevel";

const state = defineModel<{ educationLevel?: string }>({ required: true });
</script>

<template>
  <UFormField
    :label="$t('apply.items.educationLevel.label')"
    name="educationLevel"
    required
  >
    <USelect
      v-model="state.educationLevel"
      :placeholder="$t('apply.items.educationLevel.placeholder')"
      :items="
        educationLevel.map((c) => ({
          label: $t(`apply.items.educationLevel.items.${c}`),
          value: c,
        }))
      "
    />
  </UFormField>
</template>
