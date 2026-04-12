<script lang="ts" setup>
defineProps<{ motivation: string }>();
</script>

<template>
  <template v-if="!$slots.default">
    <ui-editor
      v-if="motivation"
      :model-value="motivation"
      :editable="false"
      :placeholder="$t('job.items.jobDescription.label')"
      class="max-h-100 overflow-y-auto w-full"
    />
    <slot :motivation />
  </template>

  <template v-if="!motivation && !$slots.empty">-</template>
  <slot name="empty" />
</template>
