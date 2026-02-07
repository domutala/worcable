<script lang="ts" setup>
import onFetchError from "~/tools/onFetchError";
import type { Apply, Job } from "~~/server/database/schema";

const { readonly } = defineProps<{ readonly?: boolean }>();
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
      :length="5"
      :readonly
      v-model="apply.note"
      @update:model-value="onSubmit"
    />
  </div>
</template>
