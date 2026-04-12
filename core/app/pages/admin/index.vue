<script setup lang="ts">
import type { Job } from "~~/server/database/collections";

const jobs = ref<Job[]>([]);
</script>

<template>
  <ui-job-search
    v-if="Store.session.user"
    v-slot="{ jobs, refresh, status, results, page, paginate }"
    v-model:jobs="jobs"
    admin
  >
    <div
      class="overflow-hidden lg:rounded border border-default w-full lg:w-220 mx-auto max-h-full flex-col flex lg:my-10"
    >
      <div class="scroller flex flex-col overflow-auto divide-y divide-default">
        <div class="sticky top-0 z-100 backdrop-blur-3xl">
          <ui-job-search-form
            class="h-12 lg:h-17 bg-inherit rounded-t-[inherit]"
          />
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
            class="p-0 bg-default rounded-none"
            block
          >
            <div class="flex items-center w-full min-h-20 px-7 py-4 gap-5">
              <div class="leading-[1.1] flex-1 min-w-0 w-0">
                <h1 class="leading-[1.1] text-lg font-bold truncate">
                  {{ job.title }}
                </h1>
                <div class="leading-[1.1] truncate opacity-50 text-sm">
                  {{ Utils.getDateStatus(job.createdAt) }}
                </div>
              </div>

              <div class="mx-auto"></div>

              <ui-apply-candate-group class="rounded-min" :job />
            </div>
          </u-button>
        </template>

        <template v-else-if="status === 'pending'">
          <ui-skeleton class="h-20 w-full rounded-xl bg-default/50" />
          <ui-skeleton class="h-20 w-full rounded-xl bg-default/50" />
          <ui-skeleton class="h-20 w-full rounded-xl bg-default/50" />
        </template>

        <div
          v-else
          class="flex-1 flex items-center justify-center py-40 bg-default"
        >
          <u-container class="text-center">
            <u-icon name="i-lucide-text-search" class="size-25 opacity-30" />
          </u-container>
        </div>

        <div
          v-if="results?.total"
          class="flex items-center gap-3 p-3 px-7 sticky bottom-0 bg-default z-50 mt-auto rounded-b-[inherit]"
        >
          <template v-if="results?.items.length">
            {{ (results.page - 1) * results.pageSize + results.items.length }}
            sur
            {{ results.totalItems }}
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
            :total="results.totalItems"
            :ui="{ item: 'cursor-pointer' }"
            @update:page="(p) => paginate(p)"
          />
        </div>
      </div>
    </div>
  </ui-job-search>
</template>
