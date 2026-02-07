<script lang="ts" setup>
import {
  ApplyStatus,
  ApplyStatusColors,
  type Apply,
  type Job,
} from "~~/server/database/schema";
import _, { orderBy } from "lodash";
import type { IDataResult } from "~~/server/interfaces";

const { job } = defineProps<{ job: Job }>();

const searchTerm = ref("");
const sortBy = ref("updatedAt");
const sortOrder = ref("desc");
const page = ref(1);
const pageSize = ref(8);
const filterBy = ref<`${string}:${string}` | null>(null);

const {
  data: applys,
  status,
  refresh,
} = await useFetch<IDataResult<Apply>>(`/api/admin/job/${job.id}/applys`, {
  method: "get",
  query: { sortBy, sortOrder, page, pageSize, filterBy, q: searchTerm },
  watch: [sortBy, sortOrder, page, pageSize, filterBy, searchTerm],
});

const container = useTemplateRef("container");
const emit = defineEmits<(e: "update", apply: Apply) => void>();
</script>

<template>
  <div ref="container" class="flex-1 flex flex-col gap-1">
    <u-input
      v-model="searchTerm"
      :ui="{ base: 'h-full rounded-2xl ring-0' }"
      :loading="status === 'pending'"
      icon="i-lucide-search"
      type="search"
      class="h-17 w-full outline-none"
      placeholder="Rechercher un emploi"
      size="xl"
    />

    <template v-if="applys">
      <div class="mb-1 flex gap-1 items-center">
        <div class="mx-auto"></div>
        <u-select
          v-model="filterBy"
          color="neutral"
          variant="ghost"
          trailing-icon="i-lucide-list-filter"
          class="bg-default cursor-pointer rounded-2xl"
          :items="[
            { label: $t(`apply.status.labels.all`), value: null },
            ...Object.values(ApplyStatus).map((status) => ({
              label: $t(`apply.status.${status}.label`),
              value: `status:${status}`,
            })),
          ]"
        ></u-select>

        <ui-sort
          v-model:sort-by="sortBy"
          v-model:sort-order="sortOrder"
          :content="{ align: 'start' }"
          :orderBy="{
            updatedAt: { label: $t('words.last_update') },
            status: { label: $t('apply.status.labels.label') },
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

      <div
        v-if="!applys.items.length"
        class="max-w-lg mx-auto text-center py-30"
      >
        <u-icon name="i-lucide-users-round" class="size-10" />
        <p>
          {{ $t("apply.labels.no_apply") }}
        </p>
      </div>

      <div class="w-full flex flex-col gap-2 mb-5">
        <u-modal
          v-for="apply in applys?.items"
          :key="apply.id"
          :ui="{ content: 'max-w-250 rounded-2xl' }"
        >
          <u-button
            variant="ghost"
            color="neutral"
            class="rounded-2xl p-0 bg-default cursor-pointer"
            block
          >
            <div
              class="flex items-center gap-2 p-5 relative w-full rounded-2xl text-left"
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
              </div>

              <div class="flex flex-wrap gap-1 relative">
                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="i-lucide-file-text"
                  target="_blank"
                  :href="Utils.getFileUrl(apply.data.cv)"
                >
                </UButton>

                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="i-lucide-at-sign"
                  target="_blank"
                  :href="`mailto:${apply.data.email}`"
                >
                </UButton>

                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="i-lucide-phone"
                  target="_blank"
                  :href="`tel:${apply.data.phone}`"
                >
                </UButton>

                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="i-lucide-message-square-text"
                  class="pointer-events-auto"
                >
                </UButton>
              </div>

              <div
                class="rounded-xl relative px-4 py-2 flex items-center gap-2 text-highlighted"
              >
                <div
                  class="absolute inset-0 opacity-12 rounded-xl"
                  :style="{ backgroundColor: ApplyStatusColors[apply.status] }"
                ></div>

                <u-icon
                  :name="$t(`apply.status.${apply.status}.icon`)"
                  class="size-5"
                  :style="{ color: ApplyStatusColors[apply.status] }"
                />

                {{ $t(`apply.status.${apply.status}.label`) }}
              </div>
            </div>
          </u-button>

          <template #content>
            <ui-apply-one :apply :job />
          </template>
        </u-modal>
      </div>

      <div
        v-if="applys.items.length"
        class="sticky flex items-center gap-5 bottom-0 z-20 bg-surface backdrop-blur-2xl mt-auto py-2"
      >
        <template v-if="applys.items.length">
          {{ (applys.page - 1) * applys.pageSize + applys.items.length }} sur
          {{ applys.total }}
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
          :page="applys.page"
          :items-per-page="applys.pageSize"
          :total="applys.total"
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
  </div>
</template>
