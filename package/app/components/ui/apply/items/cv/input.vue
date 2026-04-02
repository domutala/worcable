<script lang="ts" setup>
const state = defineModel<{ cv?: File }>({ required: true });
</script>

<template>
  <UFormField :label="$t('apply.items.cv.label')" name="cv" required>
    <UFileUpload
      :label="$t('apply.items.cv.placeholder')"
      :ui="{
        base: 'bg-default rounded-xl border border-primary/35 cursor-pointer',
      }"
      highlight
      color="neutral"
      :description="$t('apply.items.cv.helper')"
      class="w-full min-h-48"
      accept="application/pdf"
      layout="list"
      v-model="state.cv"
    />
  </UFormField>
</template>
