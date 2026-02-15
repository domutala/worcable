<script lang="ts" setup>
import type { DropdownMenuItem } from "@nuxt/ui";
import { applyStatusIcons } from "~/tools/apply";
import onFetchError from "~/tools/onFetchError";
import type { Apply, Job } from "~~/server/database/schema";

const submiting = ref(false);
const { readonly } = defineProps<{ readonly?: boolean }>();

const job = defineModel<Job>("job", { required: true });
const apply = defineModel<Apply>("apply", { required: true });

const items = computed(() => {
  const items: DropdownMenuItem[] = job.value.applyStatus
    .filter((status) => status.key !== apply.value.status)
    .map((status) => {
      return {
        label: status.label || $t(`apply.status.${status.key}.label`),
        value: `status:${status}`,
        icon: status.icon || applyStatusIcons[status.key],
        class: "cursor-pointer",
        onSelect: () => onSubmit(status.key),
      };
    });

  items.unshift({
    label: Use.i18n.t(`apply.status.labels.null`),
    value: "status:null",
    class: "cursor-pointer",
    icon: applyStatusIcons.null,
    onSelect: () => onSubmit(null),
  });

  return items;
});

async function onSubmit(status: string | null) {
  submiting.value = true;
  try {
    apply.value = await $fetch<Apply>(
      `/api/admin/apply/${apply.value.id}/status`,
      {
        method: "patch",
        body: { id: job.value.id, to: status },
      },
    );

    setTimeout(() => {
      dispatchEvent(
        new CustomEvent(`${apply.value.id}:update`, { detail: apply.value }),
      );
    }, 0);
  } catch (error) {
    onFetchError(error);
  } finally {
    submiting.value = false;
  }
}
</script>

<template>
  <ui-apply-status-display
    v-slot="{ color, label, icon, borderColor, bgColor }"
    v-model:job="job"
    v-model:status="apply.status"
  >
    <u-button
      v-if="readonly"
      :loading="submiting"
      :readonly
      :style="{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }"
      :icon
      color="neutral"
      variant="ghost"
      class="rounded-2xl relative px-4 text-highlighted py-3"
    >
      {{ label }}
    </u-button>

    <u-dropdown-menu v-else :items>
      <u-button
        :loading="submiting"
        :style="{
          backgroundColor: bgColor,
          border: `1px solid ${borderColor}`,
        }"
        :icon
        color="neutral"
        variant="ghost"
        class="rounded-2xl relative px-4 text-highlighted py-3 cursor-pointer"
      >
        {{ label }}
      </u-button>
    </u-dropdown-menu>
  </ui-apply-status-display>
</template>
