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

const breakpoints = useBreakpoints(breakpointsTailwind);
const hideJobContent = breakpoints.smallerOrEqual("lg");

const sortBy = ref("updatedAt");
const sortOrder = ref("desc");
const page = ref(1);
const pageSize = ref(8);

const { data, status, refresh } = await useFetch<IDataResult<Job>>(`/api/job`, {
  method: "get",
  query: { sortBy, sortOrder, page, pageSize },
  watch: [sortBy, sortOrder, page, pageSize],
});

const jobs = ref<Job[]>([]);
const currentJob = ref<Job>();
const currentJobQuery = useRouteQuery("job");

watchImmediate(
  () => data.value,
  () => {
    if (data.value?.items.length) {
      jobs.value.push(..._.cloneDeep(data.value.items));
      jobs.value = _.uniqBy(jobs.value, "id");

      if (!currentJob.value) setCurrentJob(data.value.items[0]!);
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

function openJobNewTab(e: Event, job: Job) {
  e.preventDefault();
  const route = Use.localePath({ name: "job-id", params: { id: job.id } });
  window.open(route, "_blank");

  setCurrentJob(job);
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

                <div v-if="jobs.length" class="space-y-1 px-1">
                  <u-button
                    v-for="job in jobs"
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
                      class="group flex items-center w-full min-h-20 px-7 py-4 rounded-xl border border-transparent hover:border hover:border-primary/12 relative overflow-hidden"
                    >
                      <div class="text-xl leading-[1.1]">
                        <div>
                          {{ job.title }}
                        </div>
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

                      <u-button
                        icon="i-lucide-external-link"
                        size="md"
                        variant="ghost"
                        class="absolute top-2 right-3 hidden group-hover:flex cursor-pointer"
                        @click="(e) => openJobNewTab(e, job)"
                      ></u-button>
                    </div>
                  </u-button>
                </div>

                <div
                  v-else
                  class="h-full flex items-center justify-center py-20"
                >
                  <u-container class="text-center">
                    <u-icon
                      name="i-lucide-text-search"
                      class="size-25 opacity-30"
                    />
                    <p class="mt-2">
                      {{ $t("job.labels.empty_search") }}
                    </p>
                  </u-container>
                </div>

                <div
                  v-if="data && data.total && data.page !== data.totalPages"
                  class="flex items-center gap-3 p-3 px-3"
                >
                  <u-button
                    class="cursor-pointer rounded-4xl"
                    color="neutral"
                    variant="ghost"
                    icon="i-lucide-arrow-down-wide-narrow"
                    :loading="status === 'pending'"
                    @click="page++"
                  >
                    {{ $t("words.show_more") }}
                  </u-button>

                  <div class="mx-auto"></div>
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

                  <div class="flex items-center gap-2 ml-auto">
                    <u-button
                      size="lg"
                      icon="i-lucide-send"
                      variant="soft"
                      color="neutral"
                      class="rounded- cursor-pointer"
                      square
                    >
                    </u-button>

                    <u-modal
                      :ui="{
                        content: 'max-w-250 rounded-2xl bg-surface!',
                      }"
                    >
                      <u-button size="lg" class="cursor-pointer">
                        {{ $t("apply.actions.apply") }}
                      </u-button>

                      <template #content="{ close }">
                        <div class="h-11/12 flex-1 overflow-auto">
                          <div
                            class="py-4 px-5 flex gap-5 bg-inherit/10 backdrop-blur-lg border-b border-default sticky top-0 z-50 h-max"
                          >
                            <div class="leading-none flex-1 min-w-0 w-0">
                              <h1 class="text-lg font-bold truncate">
                                {{ currentJob.title }}
                              </h1>
                              <div class="truncate opacity-50">
                                {{ Utils.getDateStatus(currentJob.createdAt) }}
                              </div>
                            </div>

                            <div>
                              <u-button
                                size="lg"
                                icon="i-lucide-x"
                                variant="soft"
                                color="neutral"
                                class="rounded-2xl cursor-pointer"
                                square
                                @click="close"
                              >
                              </u-button>
                            </div>
                          </div>

                          <div class="p-10">
                            <u-container>
                              <ui-apply-create :job="currentJob" />
                            </u-container>
                          </div>
                        </div>
                      </template>
                    </u-modal>
                  </div>
                </div>

                <u-container class="py-5">
                  <ui-job-page :job="currentJob" />
                </u-container>
              </template>
              <div v-else class="h-full flex items-center justify-center">
                <u-container class="text-center">
                  <u-icon name="i-lucide-layers" class="size-25 opacity-30" />
                  <p class="mt-5">
                    {{ $t("job.labels.emty_select") }}
                  </p>
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
