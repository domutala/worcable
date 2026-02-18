<script lang="ts" setup>
import type { DropdownMenuItem } from "@nuxt/ui";
import type { Apply, Job } from "~~/server/database/schema";

const job = defineModel<Job>("job", { required: true });
const apply = defineModel<Apply>("apply", { required: true });

const itemStates = ref<Record<string, "show" | "hide">>({});
const nShow = ref(0);
const uApply = useApply(job, apply);
const isDetailsOpen = ref(false);

const items0 = computed(() => {
  const items: DropdownMenuItem[][] = [];

  if (!nShow.value || itemStates.value.details === "hide") {
    items.push([
      {
        label: Use.i18n.t("apply.labels.show_details"),
        onSelect(e) {
          isDetailsOpen.value = true;
        },
      },
    ]);
  }

  if (!nShow.value || itemStates.value.status === "hide") {
    items.push([uApply.statusDropdown.value]);
  }

  if (!nShow.value || itemStates.value.note === "hide") {
    items.push([{ slot: "note", type: "label" }]);
  }

  return items;
});

const items = computed(() => {
  const items: DropdownMenuItem[] = [
    {
      label: Use.i18n.t("apply.labels.show_details"),
      variant: "soft",
      color: "neutral",
      class: "cursor-pointer",
      size: "lg",
      onSelect(e) {
        isDetailsOpen.value = true;
      },
    },
    {
      ...uApply.statusDropdown.value,
      size: "lg",
      variant: "soft",
      color: "neutral",
      class: "cursor-pointer",
    },
    { slot: "item-dropdown-note", type: "label", itemIndex: "note" },
  ];

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
        <ui-apply-note v-model:apply="apply" v-model:job="job" />
      </u-button>
    </template>

    <template #item-dropdown-note>
      <u-button
        color="neutral"
        variant="ghost"
        size="lg"
        class="rounded-lg relative px-4 text-highlighted cursor-pointer"
      >
        <ui-apply-note v-model:apply="apply" v-model:job="job" />
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

  <u-modal
    v-model:open="isDetailsOpen"
    :ui="{
      content: ['max-w-210', 'rounded-2xl bg-surface'],
    }"
  >
    <template #content>
      <div class="p-10">
        <ui-apply-details v-model:apply="apply" v-model:job="job" />
      </div>
    </template>
  </u-modal>
</template>
