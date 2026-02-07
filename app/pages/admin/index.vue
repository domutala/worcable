<script setup lang="ts">
import type { Job } from "~~/server/database/schema";
import type { IDataResult } from "~~/server/interfaces";
import type { BreadcrumbItem } from "@nuxt/ui";

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

function onPaginate(p: number) {
  page.value = p;
}

const items = ref<BreadcrumbItem[]>([
  {
    icon: "i-lucide-home",
    to: Use.localePath({ name: "index" }),
  },
  {
    label: Use.i18n.t("job.labels.title"),
    icon: "i-lucide-briefcase-business",
  },
]);
</script>

<template>
  <div class="overflow-auto h-full">
    <div
      class="sticky top-0 z-50 backdrop-blur-2xl bg-surface/10 px-5 py-2 border-b border-default"
    >
      <UBreadcrumb :items="items" />
    </div>

    <div class="mt-10">
      <div class="max-w-4xl flex flex-col gap-2 mx-auto">
        <div class="flex">
          <div class="mx-auto"></div>
          <nuxt-link
            :to="$localePath({ name: 'admin-job-new' })"
            class="relative rounded-2xl p-2 bg-yellow-200 text-black flex w-max"
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
        <div class="space-y-1 p-1 bg-default rounded-2xl col-span-6">
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

          <template v-if="data">
            <u-button
              v-for="job in data.items"
              :key="job.id"
              :to="
                $localePath({ name: 'admin-job-id', params: { id: job.id } })
              "
              color="neutral"
              variant="ghost"
              class="p-0 border-none bg-surface rounded-xl"
              block
            >
              <div class="flex items-center w-full min-h-20 px-7 py-4 gap-5">
                <div class="text-xl">
                  {{ job.title }}
                </div>

                <div class="mx-auto"></div>

                <ui-apply-candate-group class="rounded-xl" :job />
              </div>
            </u-button>
          </template>

          <template v-if="status === 'pending'">
            <ui-skeleton class="h-20 w-full rounded-xl bg-default/50" />
            <ui-skeleton class="h-20 w-full rounded-xl bg-default/50" />
            <ui-skeleton class="h-20 w-full rounded-xl bg-default/50" />
          </template>

          <div v-if="data" class="flex items-center gap-3 p-3 px-3">
            <template v-if="data?.items.length">
              {{ (data.page - 1) * data.pageSize + data.items.length }} sur
              {{ data.total }}
            </template>

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
</template>
