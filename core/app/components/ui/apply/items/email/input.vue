<script lang="ts" setup>
const state = defineModel<{ email: string }>({ required: true });
</script>

<template>
  <UFormField :label="$t('apply.items.email.label')" name="email" required>
    <UInput
      v-model="state.email"
      :placeholder="$t('apply.items.email.placeholder')"
      type="email"
      required
    />
  </UFormField>
</template>
