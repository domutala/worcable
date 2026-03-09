<script lang="ts" setup>
const {
  applyId: applyID,
  readonly,
  size,
} = defineProps<{
  applyId: string;
  readonly?: boolean;
  size?: string;
}>();

const { note, apply } = useApply(applyID);

const _readonly = computed(() => {
  if (!note.value.canUpdate.value) return true;
  return readonly;
});
</script>

<template>
  <div v-if="apply" class="flex items-center gap-1">
    <u-icon
      v-if="note.loading"
      name="i-lucide-loader-circle"
      class="animate-spin"
    />
    <ui-rating
      v-model="apply.note"
      :length="5"
      :readonly="_readonly"
      :size
      @update:model-value="note.submit"
    />
  </div>
</template>
