<script lang="ts" setup>
import { type Apply, type Job } from "~~/server/database/schema";
import type { IDataResult } from "~~/server/interfaces";
import { ApplyStatus } from "~~/server/services/apply_get_shema";
import { watchImmediate } from "@vueuse/core";
import type { SelectMenuItem } from "@nuxt/ui";
import { applyStatusIcons } from "~/tools/apply";
import { useRouteQuery } from "@vueuse/router";

const { job } = defineProps<{ job: Job }>();
const applyModalID = useRouteQuery("modal-apply-id");
const searchTerm = ref("");
const sortBy = ref("updatedAt");
const sortOrder = ref("desc");
const page = ref(1);
const pageSize = ref(8);
const filterBy = ref<`${string}:${string}` | null>(null);

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

const statusItems = computed(() => {
  const items: SelectMenuItem[] = job.applyStatus.map((status) => {
    return {
      label: status.label || $t(`apply.status.${status.key}.label`),
      value: `status:${status.key}`,
      icon: status.icon || applyStatusIcons[status.key],
      class: "cursor-pointer",
    };
  });

  items.unshift({
    label: Use.i18n.t(`apply.status.labels.all`),
    value: null,
    class: "cursor-pointer",
    icon: "i-lucide-text",
  });

  items.push({
    label: Use.i18n.t(`apply.status.labels.null`),
    value: "status:null",
    class: "cursor-pointer",
    icon: applyStatusIcons.null,
  });

  return items;
});
</script>

<template>
  <div ref="container" class="flex-1 flex flex-col gap-1">
    <template v-if="data">
      <div class="mb-1 flex gap-1 items-center">
        <div class="mx-auto"></div>

        <u-select
          v-model="filterBy"
          color="neutral"
          variant="ghost"
          trailing-icon="i-lucide-list-filter"
          class="bg-default cursor-pointer rounded-2xl"
          :items="statusItems"
          :ui="{ content: 'min-w-40' }"
        ></u-select>

        <ui-sort
          v-model:sort-by="sortBy"
          v-model:sort-order="sortOrder"
          :content="{ align: 'end' }"
          :orderBy="{
            updatedAt: { label: $t('words.last_update') },
            status: { label: $t('apply.status.labels.label') },
            note: { label: $t('apply.note.labels.label') },
          }"
        >
          <template #default="{ label, icon }">
            <u-button
              color="neutral"
              variant="ghost"
              class="bg-default cursor-pointer rounded-2xl"
              :trailing-icon="icon"
            >
              {{ label }}
            </u-button>
          </template>
        </ui-sort>
      </div>

      <u-input
        v-model="searchTerm"
        :ui="{ base: 'h-full rounded-2xl ring-0' }"
        :placeholder="$t('apply.actions.search_candidate')"
        :loading="status === 'pending'"
        icon="i-lucide-search"
        type="search"
        class="h-17 w-full outline-none"
        size="xl"
      />

      <div v-if="!applys.length" class="max-w-lg mx-auto text-center py-30">
        <u-icon name="i-lucide-users-round" class="size-10" />
        <p>
          {{ $t("apply.labels.no_apply") }}
        </p>
      </div>

      <div class="w-full flex flex-col gap-2 mb-5">
        <div
          v-for="(apply, i) in applys"
          :key="apply.id"
          class="w-full rounded-2xl bg-default overflow-hidden group"
        >
          <ui-apply-one v-slot="{ apply, job }" v-model:apply="applys[i]!" :job>
            <!-- <u-button
              variant="ghost"
              color="neutral"
              class="rounded-0 rounded-b-2xl p-0 bg-default cursor-pointer"
              block
              @click="applyModalID = apply.id"
            > -->
            <div
              class="flex items-center gap-4 p-5 relative rounded-b-3xl border-default w-full text-left group-hover:border-b cursor-pointer"
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

                <div>
                  {{ Utils.getDateStatus(apply.createdAt) }}
                </div>

                <ui-apply-note
                  v-model:apply="applys[i]!"
                  class="pointer-events-auto group-hover:hidden"
                  :job
                />
              </div>

              <div class="hidden md:block" @click.stop>
                <ui-apply-status-button v-model:apply="applys[i]!" :job />
              </div>
            </div>
            <!-- </u-button> -->

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
      </div>

      <div
        v-if="applys.length"
        class="sticky flex items-center gap-5 bottom-0 z-20 bg-surface backdrop-blur-2xl mt-auto py-2"
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
        class="h-20 w-full rounded-xl bg-default/30"
      />
    </template>
  </div>
</template>
