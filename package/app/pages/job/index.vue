<script lang="ts" setup>
import type { Job } from "~~/server/database/collections";
import {
  useBreakpoints,
  breakpointsTailwind,
  watchImmediate,
} from "@vueuse/core";
import _ from "lodash";
import { useRouteQuery } from "@vueuse/router";

definePageMeta({ layout: false });

const content = useTemplateRef("content");
const breakpoints = useBreakpoints(breakpointsTailwind);
const hideJobContent = breakpoints.smallerOrEqual("lg");
const currentJobQuery = useRouteQuery("job");
const search = useTemplateRef("search");

const jobs = ref<Job[]>([]);
const currentJob = ref<Job>();

watchImmediate(
  () => jobs.value,
  () => {
    if (jobs.value.length) {
      if (!currentJob.value) setCurrentJob(jobs.value[0]!);
    }
  },
  { deep: true },
);

function gotoJob(e: Event, job: Job) {
  if (!hideJobContent.value) {
    e.preventDefault();
    setCurrentJob(job);
  }
}

function setCurrentJob(job: Job) {
  currentJob.value = _.cloneDeep(job);
  currentJobQuery.value = currentJob.value.id;

  content.value?.scrollTo({ top: 0, left: 0, behavior: "smooth" });
}

function openJobNewTab(e: Event, job: Job) {
  e.preventDefault();
  const route = Use.localePath({ name: "job-id", params: { id: job.id } });
  window.open(route, "_blank");

  setCurrentJob(job);
}
</script>

<template>
  <ui-job-search
    ref="search"
    v-slot="{ jobs, refresh, status, results, page, paginate, form }"
    v-model:jobs="jobs"
  >
    <ui-layout v-if="search">
      <template #header>
        <div class="relative">
          <div class="h-12 flex items-center">
            <input
              v-model="form.searchTerm.value"
              type="search"
              autocorrect="off"
              autocapitalize="off"
              aria-autocomplete="both"
              enterkeyhint="search"
              class="outline-none w-full h-full px-5"
              placeholder="Rechercher un emploi"
              style="appearance: none"
              @keypress.enter="form.submit"
            />

            <div class="h-full">
              <u-button
                variant="ghost"
                class="h-full border-default aspect-square rounded-none p-0 justify-center cursor-pointer"
                square
                @click="form.submit"
              >
                <u-icon name="i-lucide-search" class="size-6 opacity-30" />
              </u-button>
            </div>
          </div>

          <!-- <ui-job-search-form /> -->
        </div>
      </template>

      <div class="flex-1 flex flex-col h-full">
        <div v-if="results" class="py-2 px-4 flex sticky top-0 z-5">
          <p class="text-sm">
            {{ results.total }} {{ $t("words.result", results.total) }}
          </p>
          <div class="mx-auto"></div>

          <div></div>
        </div>

        <!-- -->
        <div
          class="flex-1 overflow-hidden flex gap-1 mx-auto w-full max-w-450 lg:mt-5 lg:mb-3 lg:w-[calc(100%-20px)]"
        >
          <div
            class="w-120 h-full flex flex-col"
            :class="{ 'mx-auto w-full': hideJobContent }"
          >
            <div
              class="w-150 max-w-full lg:mt-5 flex-1 lg:rounded-min lg:border border-default overflow-hidden bg-default"
              :class="{ 'w-full': hideJobContent }"
            >
              <!-- border-b border-accented/80 dark:border-accented/30 -->
              <div
                class="max-h-full scroller overflow-auto content divide-y divide-default"
              >
                <template v-if="jobs.length">
                  <u-button
                    v-for="job in jobs"
                    :key="job.id"
                    :to="
                      $localePath({ name: 'job-id', params: { id: job.id } })
                    "
                    color="neutral"
                    variant="ghost"
                    class="p-0 border-x-0 rounded-none text-left"
                    block
                    @click="(e) => gotoJob(e, job)"
                  >
                    <div
                      class="group flex items-center w-full min-h-20 px-5 py-4 relative overflow-hidden hover:bg-default"
                      :class="{ 'bg-default': currentJob?.id === job.id }"
                    >
                      <div class="leading-[1.1]">
                        <div class="text-md md:text-xl">
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
                        class="absolute h-full w-1 left-0 top-0 bg-primary"
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
                </template>

                <div v-else-if="status === 'pending'" class="text-center py-30">
                  <u-icon
                    name="i-lucide-loader-circle"
                    class="text-primary animate-spin size-10"
                  />
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
                  v-if="results && results.totalItems"
                  class="flex items-center gap-3 py-1 px-3 mt-auto border-b border-default"
                >
                  <template v-if="jobs.length">
                    {{
                      (results.page - 1) * results.pageSize +
                      results.items.length
                    }}
                    sur
                    {{ results.totalItems }}
                  </template>

                  <div class="mx-auto"></div>

                  <UPagination
                    show-edges
                    variant="ghost"
                    color="neutral"
                    active-color="neutral"
                    active-variant="soft"
                    size="sm"
                    :sibling-count="1"
                    :page="results.page"
                    :items-per-page="results.pageSize"
                    :total="results.totalItems"
                    :ui="{ item: 'cursor-pointer' }"
                    @update:page="(p) => paginate(p)"
                  />
                </div>
              </div>
            </div>
          </div>

          <div v-if="!hideJobContent" class="h-full flex flex-col w-full">
            <div
              class="w-full border border-default lg:mt-5 flex-1 rounded-min overflow-hidden bg-default"
            >
              <div ref="content" class="h-full overflow-auto scroller always">
                <template v-if="currentJob">
                  <div
                    class="py-4 px-5 flex gap-5 border-b border-default sticky top-0 z-50 rounded-t-min backdrop-blur-2xl bg-default/20"
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
                      <u-button
                        size="lg"
                        class="cursor-pointer"
                        color="primary"
                        variant="solid"
                        @click="
                          () => {
                            const { value } = useModal({ uid: 'appy-for' });
                            value.value = currentJob?.id;
                          }
                        "
                      >
                        {{ $t("apply.actions.apply") }}
                      </u-button>
                    </div>
                  </div>

                  <u-container class="py-20">
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
    </ui-layout>
  </ui-job-search>
</template>
