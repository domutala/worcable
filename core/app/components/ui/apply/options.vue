<script lang="ts" setup>
import type { DropdownMenuItem } from "@nuxt/ui";

const { applyId: applyID } = defineProps<{ applyId: string }>();
const { status, note } = useApply(applyID);

const modal = useTemplateRef("modal");

const items = computed(() => {
  const items: DropdownMenuItem[] = [
    {
      label: Use.i18n.t("apply.labels.show_details"),
      onSelect(e) {
        if (modal.value) modal.value.open = true;
      },
    },
  ];

  if (status.value.canUpdate.value) {
    items.push({ ...status.value.dropdownMenuItems.value });
  }

  if (note.value.canUpdate.value) {
    items.push({
      slot: "item-dropdown-note",
      type: "label",
      itemIndex: "note",
    });
  }

  return items;
});
</script>

<template>
  <ui-menu-horizontal-items :items :gap="5" :ui="{ base: 'justify-end' }">
    <template #item-note>
      <u-button
        color="neutral"
        variant="soft"
        size="lg"
        class="rounded-lg relative px-4 text-highlighted cursor-pointer"
      >
        <ui-apply-note :apply-id="applyID" />
      </u-button>
    </template>

    <template #item-dropdown-note>
      <u-button
        color="neutral"
        variant="ghost"
        size="lg"
        class="rounded-lg relative px-4 text-highlighted cursor-pointer"
      >
        <ui-apply-note :apply-id="applyID" />
      </u-button>
    </template>
  </ui-menu-horizontal-items>

  <!-- <u-dropdown-menu
    :ui="{ item: 'cursor-pointer' }"
    :content="{ align: 'end' }"
    :items
  >
    <div>sdfsfsf</div>
    <template #item> sdfsdf </template>
  </u-dropdown-menu> -->
  <!-- <ui-menu-horizontal
    v-model:states="itemStates"
    v-model:n-show="nShow"
    :ui="{ base: 'justify-end' }"
    :gap="5"
  >
    <u-button
      item-index="details"
      color="neutral"
      variant="ghost"
      class="rounded-lg relative px-4 text-highlighted py-0 cursor-pointer bg-surface h-11"
      @click="isDetailsOpen = true"
    >
      {{ $t("apply.labels.show_details") }}
    </u-button>

    <u-button
      item-index="note"
      color="neutral"
      variant="ghost"
      class="rounded-lg relative px-4 text-highlighted py-0 cursor-pointer bg-surface h-11"
    >
      <ui-apply-note v-model:apply="apply" v-model:job="job" />
    </u-button>

    <ui-apply-status-button
      v-slot="{ label, icon, submiting }"
      v-model:apply="apply"
      v-model:job="job"
    >
      <u-button
        item-index="status"
        :loading="submiting"
        :icon
        color="neutral"
        variant="ghost"
        class="rounded-lg relative px-4 text-highlighted py-0 cursor-pointer bg-surface h-11"
      >
        {{ label }}
      </u-button>
    </ui-apply-status-button>

    <template #after>
      <u-dropdown-menu
        v-if="items.length"
        :ui="{ item: 'cursor-pointer' }"
        :content="{ align: 'end' }"
        :items
      >
        <template #note>
          <div class="px-4 mx-auto">
            <ui-apply-note
              v-model:apply="apply"
              v-model:job="job"
              size="22px"
            />
          </div>
        </template>

        <u-button
          item-index="notification"
          icon="i-lucide-text"
          size="xl"
          color="neutral"
          variant="ghost"
          class="cursor-pointer"
          :ui="{ leadingIcon: 'rotate-z-180' }"
        ></u-button>
      </u-dropdown-menu>
    </template>
  </ui-menu-horizontal> -->

  <ui-modal-2 ref="modal" :ui="{ content: ['max-w-210', 'rounded-2xl'] }">
    <template #content>
      <ui-layout-inset>
        <div class="sm:p-10 p-2 py-3">
          <ui-apply-details :apply-id="applyID" />
        </div>
      </ui-layout-inset>
    </template>
  </ui-modal-2>
</template>
