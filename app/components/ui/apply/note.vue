<script lang="ts" setup>
import onFetchError from "~/tools/onFetchError";
import type { Apply, Job } from "~~/server/database/schema";

const { readonly, size } = defineProps<{ readonly?: boolean; size?: string }>();
const submiting = ref(false);
const job = defineModel<Job>("job", { required: true });
const apply = defineModel<Apply>("apply", { required: true });

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
      :readonly
      :size
      @update:model-value="onSubmit"
    />
  </div>
</template>
