<script lang="ts" setup>
import type { Job } from "~~/server/database/schema";
import type { IDataResult } from "~~/server/interfaces";
import {
  useBreakpoints,
  breakpointsTailwind,
  watchImmediate,
} from "@vueuse/core";
import _ from "lodash";
import { useRouteQuery } from "@vueuse/router";
import UiHeader from "~/components/header.vue";

definePageMeta({ layout: false });

const sortBy = ref("updatedAt");
const sortOrder = ref("desc");
const page = ref(1);
const pageSize = ref(9);

const { data, status, refresh } = await useFetch<IDataResult<Job>>(
  `/api/admin/job`,
  {
    method: "get",
    query: { sortBy, sortOrder, page, pageSize },
    watch: [sortBy, sortOrder, page, pageSize],
  },
);

const breakpoints = useBreakpoints(breakpointsTailwind);
const hideJobContent = breakpoints.smallerOrEqual("lg");
const currentJob = ref<Job>();
const currentJobQuery = useRouteQuery("job");

watchImmediate(
  () => data.value,
  () => {
    if (data.value?.items.length && !currentJob.value) {
      setCurrentJob(data.value.items[0]!);
    }
  },
  { deep: true },
);

function onPaginate(p: number) {
  page.value = p;
}

function gotoJob(e: Event, job: Job) {
  if (!hideJobContent.value) {
    e.preventDefault();
    setCurrentJob(job);
  }
}

function setCurrentJob(job: Job) {
  currentJob.value = _.cloneDeep(job);
  currentJobQuery.value = currentJob.value.id;
}
</script>

<template>
  <div class="h-screen flex flex-col">
    <UiHeader class="border-b border-default" />

    <div
      class="flex-1 overflow-hidden flex flex-col mx-auto max-w-380 w-full px-6"
    >
      <div class="pt-5">
        <div class="bg-surface h-17 rounded-2xl flex items-center">
          <div class="w-full h-full relative">
            <input
              type="search"
              class="h-full w-full outline-none pl-18 pr-5"
              placeholder="Rechercher un emploi"
            />
            <div
              class="h-full absolute top-0 flex items-center justify-center w-20 pointer-events-auto"
            >
              <u-icon name="i-lucide-search" class="size-8 opacity-50" />
            </div>
          </div>

          <div
            class="w-105 border-l h-full border-accented flex items-center relative"
          >
            <input
              type="search"
              class="h-full w-full outline-none pl-18 pr-5"
              placeholder="Rechercher un emploi"
            />
            <div
              class="h-full absolute top-0 flex items-center justify-center w-20 pointer-events-auto"
            >
              <u-icon name="i-lucide-map-pin" class="size-6 opacity-50" />
            </div>
          </div>
        </div>
      </div>

      <div class="flex-1 overflow-hidden flex gap-2 w-full mx-auto">
        <div
          class="w-1/2 h-full flex flex-col"
          :class="{ 'mx-auto w-full': hideJobContent }"
        >
          <div
            class="w-150 max-w-full my-5 flex-1 rounded-2xl overflow-hidden"
            :class="{ 'w-full': hideJobContent }"
          >
            <div class="max-h-full overflow-auto content">
              <div class="space-y-1 py-1 bg-surface rounded-2xl">
                <div
                  v-if="data"
                  class="py-2 px-4 flex sticky top-0 border-b border-accented/80 dark:border-accented/30 mb-2"
                >
                  <p class="text-sm">
                    {{ data.total }} {{ $t("words.result", data.total) }}
                  </p>
                  <div class="mx-auto"></div>

                  <div></div>
                </div>

                <div v-if="data" class="space-y-1 px-1">
                  <u-button
                    v-for="job in data.items"
                    :key="job.id"
                    :to="
                      $localePath({ name: 'job-id', params: { id: job.id } })
                    "
                    color="neutral"
                    variant="ghost"
                    class="p-0 border-none bg-default rounded-xl text-left"
                    block
                    @click="(e) => gotoJob(e, job)"
                  >
                    <div
                      class="flex items-center w-full min-h-20 px-7 py-4 rounded-xl border border-transparent hover:border hover:border-primary/12 relative overflow-hidden"
                    >
                      <div class="text-xl leading-[1.1]">
                        {{ job.title }}
                        <div class="text-sm">
                          {{ job.location }}
                          <div class="opacity-50">
                            {{ Utils.getDateStatus(job.createdAt) }}
                          </div>
                        </div>
                      </div>

                      <div class="mx-auto"></div>

                      <div
                        class="absolute h-full w-1.5 left-0 top-0 bg-primary"
                        v-if="currentJob?.id === job.id"
                      ></div>
                    </div>
                  </u-button>
                </div>

                <div v-if="data" class="flex items-center gap-3 p-3 px-3">
                  <div class="mx-auto"></div>
                  <UPagination
                    show-edges
                    variant="ghost"
                    color="neutral"
                    active-color="neutral"
                    active-variant="soft"
                    size="sm"
                    :page="data.page"
                    :items-per-page="data.pageSize"
                    :total="data.total"
                    :ui="{ item: 'cursor-pointer' }"
                    @update:page="onPaginate"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!hideJobContent" class="h-full flex flex-col w-full">
          <div
            class="w-full border border-default my-5 flex-1 rounded-2xl overflow-hidden"
          >
            <div class="h-full overflow-auto content">
              <template v-if="currentJob">
                <div
                  class="py-4 px-5 flex gap-5 bg-inherit/10 backdrop-blur-lg border-b border-default sticky top-0 z-50"
                >
                  <div class="leading-none flex-1 min-w-0 w-0">
                    <h1 class="text-lg font-bold truncate">
                      {{ currentJob.title }}
                    </h1>
                    <div class="truncate opacity-50">
                      {{ Utils.getDateStatus(currentJob.createdAt) }}
                    </div>
                  </div>

                  <div class="flex items-center ml-auto">
                    <u-button size="xl">Postuler</u-button>
                  </div>
                </div>

                <u-container class="py-5">
                  <ui-job-page :job="currentJob" />
                </u-container>
              </template>
              <div v-else class="h-full flex items-center justify-center">
                <u-container class="text-center">
                  <u-icon name="i-lucide-layers" class="size-25 opacity-30" />
                  <p class="mt-5">Aucun emploi trouvé</p>
                </u-container>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content {
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgb(73, 73, 73);
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
}
</style>
