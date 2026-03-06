<script lang="ts" setup>
import onFetchError from "~/tools/onFetchError";
import type { Apply, Job } from "~~/server/database/collections";

const { readonly, size } = defineProps<{ readonly?: boolean; size?: string }>();
const submiting = ref(false);
const job = defineModel<Job>("job", { required: true });
const apply = defineModel<Apply>("apply", { required: true });
const { canUserUpdateNote } = useApply(job, apply);

async function onSubmit(note: number) {
  submiting.value = true;
  try {
    apply.value = await $fetch<Apply>(
      `/api/admin/apply/${apply.value.id}/note`,
      {
        method: "patch",
        body: { id: job.value.id, note },
      },
    );

    dispatchEvent(
      new CustomEvent(`${apply.value.id}:update`, { detail: apply.value }),
    );
  } catch (error) {
    onFetchError(error);
  } finally {
    submiting.value = false;
  }
}

const _readonly = computed(() => {
  if (!canUserUpdateNote.value) return true;
  return readonly;
});
</script>

<template>
  <div class="flex items-center gap-1">
    <u-icon
      v-if="submiting"
      name="i-lucide-loader-circle"
      class="animate-spin"
    />
    <ui-rating
      v-model="apply.note"
      :length="5"
      :readonly="_readonly"
      :size
      @update:model-value="onSubmit"
    />
  </div>
</template>
