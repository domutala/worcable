<script lang="ts" setup>
import { type Apply, type Job } from "~~/server/database/schema";
import type { IDataResult } from "~~/server/interfaces";
import { watchImmediate } from "@vueuse/core";
import type { DropdownMenuItem } from "@nuxt/ui";
import { applyStatusIcons } from "~/tools/apply";
import { useRouteQuery } from "@vueuse/router";

const {
  sortBy,
  sortOrder,
  icon,
  label,
  itemsDropdown: sortItems,
} = useSort({
  orderBy: {
    updatedAt: { label: Use.i18n.t("words.last_update") },
    status: { label: Use.i18n.t("apply.status.labels.label") },
    note: { label: Use.i18n.t("apply.note.labels.label") },
  },
});

const { job } = defineProps<{ job: Job }>();
const applyModalID = useRouteQuery("modal-apply-id");
const searchTerm = ref("");
const page = ref(1);
const pageSize = ref(8);
const filterBy = ref<string | null>(null);

const { data, status, refresh } = await useFetch<IDataResult<Apply>>(
  `/api/admin/job/${job.id}/applys`,
  {
    method: "get",
    query: { sortBy, sortOrder, page, pageSize, filterBy, q: searchTerm },
    watch: [sortBy, sortOrder, page, pageSize, filterBy, searchTerm],
  },
);

const applys = ref<Apply[]>([]);

watch(
  () => filterBy.value,
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

const _items = ref([
  {
    value: null,
    label: Use.i18n.t(`apply.status.labels.all`),
    icon: "i-lucide-text",
  },
  ...job.applyStatus.map((status) => {
    return {
      value: `status:${status.key}`,
      label: status.label || $t(`apply.status.${status.key}.label`),
      icon: status.icon || applyStatusIcons[status.key],
    };
  }),
  {
    value: "status:null",
    label: Use.i18n.t(`apply.status.labels.null`),
    icon: applyStatusIcons.null,
  },
]);
const statusItems = computed(() => {
  const items = _items.value.map((status) => {
    return {
      ...status,
      class: "cursor-pointer",
      onSelect() {
        filterBy.value = status.value;
      },
    };
  });

  return {
    children: items,
    label: _items.value.find((status) => status.value === filterBy.value)
      ?.label,
    icon: _items.value.find((status) => status.value === filterBy.value)?.icon,
    variant: "ghost",
  } as DropdownMenuItem;
});

const sorts = computed(() => {
  return [statusItems.value, { ...sortItems.value, variant: "ghost" }];
});
</script>

<template>
  <div
    ref="container"
    class="overflow-hidden lg:rounded border border-default w-full lg:w-250 mx-auto flex-1 flex-col flex lg:mb-10"
  >
    <div class="scroller flex-1 flex flex-col overflow-auto">
      <div class="flex flex-col flex-1 divide-y divide-default">
        <template v-if="data">
          <u-input
            v-model="searchTerm"
            :ui="{
              base: 'h-full  ring-0! bg-transparent pl-13',
              trailing: 'pr-5',
            }"
            :placeholder="$t('apply.actions.search_candidate')"
            :loading="status === 'pending'"
            icon="i-lucide-search"
            type="search"
            class="h-17 w-full outline-none"
            size="xl"
          >
          </u-input>

          <div class="flex items-center px-3 py-1 bg-">
            <ui-menu-horizontal-items :items="sorts" :gap="5" :min-to-show="2">
              <template #activator>
                <u-button size="md" icon="i-lucide-list-filter" square />
              </template>
            </ui-menu-horizontal-items>
          </div>

          <div v-if="!applys.length" class="max-w-lg mx-auto text-center py-30">
            <u-icon name="i-lucide-users-round" class="size-10" />
            <p>
              {{ $t("apply.labels.no_apply") }}
            </p>
          </div>

          <div
            v-for="(apply, i) in applys"
            :key="apply.id"
            class="w-full bg-default overflow-hidden group hover:bg-surface/10"
          >
            <ui-apply-one
              v-slot="{ apply, job }"
              v-model:apply="applys[i]!"
              :job
            >
              <div
                class="flex items-center gap-4 p-5 relative border-default w-full text-left group-hover:border-b cursor-pointer"
                @click="applyModalID = apply.id"
              >
                <UAvatar
                  :src="Utils.getFileUrl(apply.data.avatar)"
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
                  v-model:apply="applys[i]!"
                  class="pointer-events-auto group-hover:hidden"
                  size="14px"
                  :job
                />

                <div class="hidden md:block" @click.stop>
                  <ui-apply-status-button v-model:apply="applys[i]!" :job />
                </div>
              </div>

              <div
                class="px-5 gap-5 flex items-center h-0 group-hover:h-10 transition-all overflow-hidden"
              >
                <ui-apply-note
                  v-model:apply="applys[i]!"
                  class="pointer-events-auto"
                  :job
                />

                <div class="mx-auto"></div>

                <div class="flex flex-wrap gap-1 relative">
                  <UButton
                    color="neutral"
                    variant="ghost"
                    icon="i-lucide-file-text"
                    target="_blank"
                    size="sm"
                    :href="Utils.getFileUrl(apply.data.cv)"
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
            </ui-apply-one>
          </div>

          <div
            v-if="applys.length"
            class="sticky flex items-center gap-5 bottom-0 z-20 bg-default backdrop-blur-2xl py-2 px-5 mt-auto"
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
