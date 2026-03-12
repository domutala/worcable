<script lang="ts" setup>
const state = defineModel<{ lastName: string }>({ required: true });
</script>

<template>
  <UFormField
    :label="$t('apply.items.lastName.label')"
    name="lastName"
    required
  >
    <UInput
      v-model="state.lastName"
      :placeholder="$t('apply.items.lastName.placeholder')"
      required
    />
  </UFormField>
</template>
