<script lang="ts" setup>
const state = defineModel<{ motivation?: string }>({ required: true });
</script>

<template>
  <UFormField :label="$t('apply.items.motivation.label')" name="motivation">
    <ui-editor
      v-model="state.motivation"
      :placeholder="$t('apply.items.motivation.placeholder')"
      class="max-h-100 bg-default border border-default rounded-2xl overflow-auto"
    />
  </UFormField>
</template>
