<script lang="ts" setup>
import { applyStatusColors } from "~/tools/apply";
import onFetchError from "~/tools/onFetchError";
import type { Apply, Job } from "~~/server/database/schema";
import { ApplyStatus } from "~~/server/services/apply_get_shema";

const submiting = ref(false);
const { readonly } = defineProps<{ readonly?: boolean }>();

const job = defineModel<Job>("job", { required: true });
const apply = defineModel<Apply>("apply", { required: true });

async function onSubmit(status: ApplyStatus) {
  submiting.value = true;
  try {
    apply.value = await $fetch<Apply>(
      `/api/admin/apply/${apply.value.id}/status`,
      {
        method: "patch",
        body: { id: job.value.id, to: status },
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
  <u-button
    v-if="readonly"
    :loading="submiting"
    :icon="$t(`apply.status.${apply.status}.icon`)"
    :readonly
    :style="{
      backgroundColor: `color-mix(in srgb, ${applyStatusColors[apply.status]} 10%, #000 0%)`,
    }"
    color="neutral"
    variant="ghost"
    class="rounded-2xl relative px-4 text-highlighted py-3"
  >
    {{ $t(`apply.status.${apply.status}.label`) }}
  </u-button>

  <u-dropdown-menu
    v-else
    :items="
      Object.values(ApplyStatus)
        .filter((status) => status !== apply.status)
        .map((status) => ({
          label: $t(`apply.status.${status}.label`),
          value: `status:${status}`,
          icon: $t(`apply.status.${status}.icon`),
          class: 'cursor-pointer',
          onSelect: () => onSubmit(status),
        }))
    "
  >
    <u-button
      :loading="submiting"
      :icon="$t(`apply.status.${apply.status}.icon`)"
      :readonly
      :style="{
        backgroundColor: `color-mix(in srgb, ${applyStatusColors[apply.status]} 10%, #000 0%)`,
      }"
      color="neutral"
      variant="ghost"
      class="rounded-2xl relative px-4 text-highlighted py-3 cursor-pointer"
    >
      {{ $t(`apply.status.${apply.status}.label`) }}
    </u-button>
  </u-dropdown-menu>
</template>
