<script lang="ts" setup>
const state = defineModel<{ firstName: string }>({ required: true });
</script>

<template>
  <UFormField
    :label="$t('apply.items.firstName.label')"
    name="firstName"
    required
  >
    <UInput
      v-model="state.firstName"
      :placeholder="$t('apply.items.firstName.placeholder')"
      required
    />
  </UFormField>
</template>
