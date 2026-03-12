<script lang="ts" setup>
import { type Apply } from "~~/server/database/collections";
import type { IDataResult } from "~~/server/interfaces";
import { watchImmediate } from "@vueuse/core";

const {
  sortBy,
  sortOrder,
  itemsDropdown: sortItems,
} = useSort({
  orderBy: {
    updatedAt: { label: Use.i18n.t("words.last_update") },
    status: { label: Use.i18n.t("apply.status.labels.label") },
    note: { label: Use.i18n.t("apply.note.labels.label") },
  },
});

const sortItems2 = ref({
  updatedAt: { label: Use.i18n.t("words.last_update") },
  status: { label: Use.i18n.t("apply.status.labels.label") },
  note: { label: Use.i18n.t("apply.note.labels.label") },
});

const { jobId: jobID } = defineProps<{ jobId: string }>();
const { applyStatus, job, ready } = useJob(jobID);
const { value: applyModalID } = useModal({ uid: "modal-apply-id" });
const searchTerm = ref("");
const page = ref(1);
const pageSize = ref(8);

const { data, status } = await useFetch<IDataResult<Apply>>(
  `/api/admin/job/${jobID}/applys`,
  {
    method: "get",
    query: {
      sortBy,
      sortOrder,
      page,
      pageSize,
      filterBy: applyStatus.value.filterBy,
      q: searchTerm,
    },
    watch: [
      sortBy,
      sortOrder,
      page,
      pageSize,
      applyStatus.value.filterBy,
      searchTerm,
    ],
  },
);

const applys = ref<Apply[]>([]);

watch(
  () => applyStatus.value.filterBy,
  () => {
    applys.value = [];
  },
);
watchImmediate(
  () => data.value,
  () => {
    applys.value = data.value?.items || [];
  },
  { deep: true },
);

const sorts = computed(() => {
  return [applyStatus.value.filterItems.value, { ...sortItems.value }];
});

const filterItems = computed(() => {
  const _items = [
    {
      value: null,
      label: Use.i18n.t(`apply.status.labels.all`),
      icon: "i-lucide-text",
    },
    ...job.value.applyStatus.map((status) => {
      return {
        value: `status:${status.key}`,
        label: status.label || Use.i18n.t(`apply.status.${status.key}.label`),
        icon: status.icon || applyStatusIcons[status.key],
      };
    }),
    {
      value: "status:null",
      label: Use.i18n.t(`apply.status.labels.null`),
      icon: applyStatusIcons.null,
    },
  ];

  const label = _items.find(
    (status) => status.value === applyStatus.value.filterBy.value,
  )?.label;
  const icon = _items.find(
    (status) => status.value === applyStatus.value.filterBy.value,
  )?.icon;

  const items = applyStatus.value.filterItems.value.children;

  return { label, icon, items };
});
</script>

<template>
  <div
    v-if="job && ready"
    ref="container"
    class="overflow-hidden lg:rounded border border-default w-full lg:w-250 mx-auto max-h-full flex-col flex lg:mb-10"
  >
    <div class="scroller flex flex-col overflow-auto">
      <div class="flex flex-col divide-y divide-default">
        <template v-if="data">
          <div class="relative group flex items-center">
            <u-input
              v-model="searchTerm"
              :ui="{
                base: 'h-full ring-0! bg-transparent pl-13 rounded-none!',
                trailing: 'pr-5',
              }"
              :placeholder="$t('apply.actions.search_candidate')"
              :loading="status === 'pending'"
              icon="i-lucide-search"
              class="h-17 w-full outline-none"
              size="xl"
            >
            </u-input>

            <!-- absolute right-0 top-1/2 -translate-y-1/2  -->

            <div
              class="flex items-center justify-end gap-2 group-focus-within:hidden pr-5 w-"
            >
              <u-dropdown-menu :items="filterItems.items">
                <u-button
                  size="md"
                  class="whitespace-nowrap"
                  :icon="filterItems.icon"
                >
                  {{ filterItems.label }}
                </u-button>
              </u-dropdown-menu>

              <ui-sort
                :orderBy="sortItems2"
                :btn-props="{ size: 'md', variant: 'soft' }"
                v-model:sort-by="sortBy"
                v-model:sort-order="sortOrder"
              />
            </div>
          </div>

          <div v-if="!applys.length" class="max-w-lg mx-auto text-center py-30">
            <u-icon name="i-lucide-users-round" class="size-10" />
            <p>
              {{ $t("apply.labels.no_apply") }}
            </p>
          </div>

          <div
            v-for="(apply, i) in applys"
            :key="apply.id + i"
            class="w-full bg-default overflow-hidden group hover:bg-surface/10"
          >
            <div
              class="flex items-center gap-4 p-5 relative border-default w-full text-left group-hover:border-b cursor-pointer"
              @click="applyModalID = apply.id"
            >
              <UAvatar
                :src="Doc.getUrl(apply.data.avatar)"
                :alt="[apply.data.firstName, apply.data.lastName].join(' ')"
                class="border border-accented rounded-2xl text-md"
                size="3xl"
              />

              <div class="select-none leading-[1.1] flex-1 min-w-0 w-0">
                <div class="font-bold truncate">
                  {{ apply.data.firstName }}
                  {{ apply.data.lastName }}
                </div>

                <div class="text-sm opacity-50">
                  {{ Utils.getDateStatus(apply.createdAt) }}
                </div>
              </div>

              <ui-apply-note
                :apply-id="apply.id"
                class="pointer-events-auto group-hover:hidden"
                size="14px"
              />

              <div class="hidden md:block" @click.stop>
                <ui-apply-status-button :apply-id="apply.id" />
              </div>
            </div>

            <div
              class="px-5 gap-5 flex items-center h-0 group-hover:h-10 transition-all overflow-hidden"
            >
              <ui-apply-note :apply-id="apply.id" class="pointer-events-auto" />

              <div class="mx-auto"></div>

              <div class="flex flex-wrap gap-1 relative">
                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="i-lucide-file-text"
                  target="_blank"
                  size="sm"
                  :href="Doc.getUrl(apply.data.cv)"
                >
                </UButton>

                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="i-lucide-at-sign"
                  target="_blank"
                  size="sm"
                  :href="`mailto:${apply.data.email}`"
                >
                </UButton>

                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="i-lucide-phone"
                  target="_blank"
                  size="sm"
                  :href="`tel:${apply.data.phone}`"
                >
                </UButton>

                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="i-lucide-message-square-text"
                  class="pointer-events-auto"
                  size="sm"
                >
                </UButton>
              </div>
            </div>
          </div>

          <div
            v-if="applys.length"
            class="sticky flex items-center gap-5 bottom-0 z-20 bg-default py-2 px-5"
          >
            <template v-if="applys.length">
              {{ (data.page - 1) * data.pageSize + data.items.length }} sur
              {{ data.total }}
            </template>

            <div class="mx-auto"></div>

            <UPagination
              show-edges
              :sibling-count="1"
              variant="ghost"
              color="neutral"
              active-color="neutral"
              active-variant="soft"
              size="sm"
              :page="data.page"
              :items-per-page="data.pageSize"
              :total="data.total"
              :ui="{ item: 'cursor-pointer' }"
              @update:page="(p) => (page = p)"
            />

            <u-progress
              v-if="status === 'pending'"
              class="absolute top-0"
              size="xs"
            />
          </div>
        </template>

        <template v-else-if="status === 'pending'">
          <ui-skeleton
            v-for="i in 5"
            :key="i"
            class="h-20 w-full border-default"
          />
        </template>
      </div>
    </div>
  </div>
</template>
