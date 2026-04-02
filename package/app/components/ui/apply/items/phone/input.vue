<script lang="ts" setup>
const state = defineModel<{ phone: string }>({ required: true });
</script>

<template>
  {{ typeof state.phone }}
  <UFormField :label="$t('apply.items.phone.label')" name="phone" required>
    <UInput
      v-model="state.phone"
      :placeholder="$t('apply.items.phone.placeholder')"
      type="tel"
      required
    />
  </UFormField>
</template>
