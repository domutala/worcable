<script setup lang="ts">
import type { Job } from "~~/server/database/schema";
const jobs = ref<Job[]>([]);
</script>

<template>
  <ui-job-search
    v-slot="{ jobs, refresh, status, results, page, paginate }"
    v-model:jobs="jobs"
  >
    <div class="h-[99%] flex flex-col overflow-hidden">
      <UiBreadcrumb :breads="['$home', '$admin']" />

      <div class="flex-1 flex flex-col overflow-hidden">
        <div class="flex max-w-full w-4xl mx-auto mb-2">
          <div class="mx-auto"></div>
          <nuxt-link
            :to="$localePath({ name: 'admin-job-new' })"
            class="relative rounded-4xl p-2 bg-yellow-200 text-black flex w-max"
          >
            <div class="text-sm ml-5 mr-3 h-max my-auto">
              {{ $t("job.actions.new") }}
            </div>

            <div
              class="aspect-square bg-black h-12 rounded-full flex items-center justify-center"
            >
              <u-icon name="i-lucide-plus" class="size-7 text-white" />
            </div>
          </nuxt-link>
        </div>

        <div
          class="max-w-full w-4xl gap-2 mx-auto flex-1 rounded-2xl overflow-hidden mb-5"
        >
          <div
            class="max-h-full overflow-auto bg-default rounded-2xl col-span-6"
          >
            <div class="bg-default sticky top-0 z-50 p-1">
              <ui-job-search-form class />
            </div>

            <div class="p-1 space-y-1">
              <div class="py-2 px-2 hidden">
                <h1>
                  {{ $t("job.labels.title") }}
                </h1>
                <div class="mx-auto"></div>

                <div>
                  <u-button
                    icon="i-lucide-plus"
                    class="rounded-3xl"
                    :to="$localePath({ name: 'admin-job-new' })"
                  >
                    {{ $t("job.actions.new") }}
                  </u-button>
                </div>
              </div>

              <template v-if="results?.items.length">
                <u-button
                  v-for="job in results.items"
                  :key="job.id"
                  :to="
                    $localePath({
                      name: 'admin-job-id',
                      params: { id: job.id },
                    })
                  "
                  color="neutral"
                  variant="ghost"
                  class="p-0 border-none bg-surface rounded-xl"
                  block
                >
                  <div
                    class="flex items-center w-full min-h-20 px-7 py-4 gap-5"
                  >
                    <div class="leading-none flex-1 min-w-0 w-0">
                      <h1 class="text-lg font-bold truncate">
                        {{ job.title }}
                      </h1>
                      <div class="truncate opacity-50">
                        {{ Utils.getDateStatus(job.createdAt) }}
                      </div>
                    </div>

                    <div class="mx-auto"></div>

                    <ui-apply-candate-group class="rounded-xl" :job />
                  </div>
                </u-button>
              </template>

              <template v-else-if="status === 'pending'">
                <ui-skeleton class="h-20 w-full rounded-xl bg-default/50" />
                <ui-skeleton class="h-20 w-full rounded-xl bg-default/50" />
                <ui-skeleton class="h-20 w-full rounded-xl bg-default/50" />
              </template>

              <div v-else class="h-full flex items-center justify-center py-20">
                <u-container class="text-center">
                  <u-icon
                    name="i-lucide-text-search"
                    class="size-25 opacity-30"
                  />
                </u-container>
              </div>
            </div>

            <div
              v-if="results"
              class="flex items-center gap-3 p-3 px-3 sticky bottom-0 bg-default z-50"
            >
              <template v-if="results?.items.length">
                {{
                  (results.page - 1) * results.pageSize + results.items.length
                }}
                sur
                {{ results.total }}
              </template>

              <div class="mx-auto"></div>

              <UPagination
                v-if="jobs.length"
                show-edges
                variant="ghost"
                color="neutral"
                active-color="neutral"
                active-variant="soft"
                size="sm"
                :page="results.page"
                :items-per-page="results.pageSize"
                :total="results.total"
                :ui="{ item: 'cursor-pointer' }"
                @update:page="(p) => paginate(p)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </ui-job-search>
</template>
