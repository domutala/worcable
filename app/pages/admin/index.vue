<script setup lang="ts">
import UiHeader from "~/components/header.vue";
import type { Job } from "~~/server/database/schema";
const jobs = ref<Job[]>([]);
</script>

<template>
  <ui-job-search
    v-if="Store.session.user"
    v-slot="{ jobs, refresh, status, results, page, paginate }"
    v-model:jobs="jobs"
  >
    <ui-layout :breads="['$home', '$admin']">
      <!-- <UiBreadcrumb
        :breads="['$home', '$admin']"
        class="flex items-center gap-5"
      /> -->

      <template #header>
        <ui-header class="relative" />
      </template>

      <div class="flex-1 flex flex-col">
        <div class="hidden xl:hidden">
          <div class="h-full border-r border-accented/60 w-100">
            <div class="p-5">
              <UAvatar
                :src="Utils.getFileUrl(Store.session.user.avatar)"
                :alt="`${Store.session.user.firstName} ${Store.session.user.lastName}`"
                class="rounded-2xl text-sm size-16 border border-default bg-default"
              />

              <div class="leading-none mt-3">
                <div>
                  {{ Store.session.user.firstName }}
                  {{ Store.session.user.lastName }}
                </div>

                <div class="text-sm opacity-50">
                  {{ Store.session.user.email }}
                </div>
              </div>

              <p class="mt-5">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Veritatis, voluptatibus pariatur praesentium, sed accusantium
                suscipit aliquid id cumque perspiciatis quia exercitationem.
                Tempora, quia. Amet, exercitationem commodi pariatur iusto optio
                facilis!
              </p>
            </div>
          </div>
        </div>

        <!-- <div class="hidden max-w-full w-4xl mx-auto mb-2">
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
        </div> -->

        <div
          class="divide-y divide-default ring ring-default lg:rounded w-full lg:w-220 mx-auto lg:my-15 overflow-hidden flex-1 lg:flex-none flex flex-col"
        >
          <ui-job-search-form
            class="h-12 lg:h-17 bg-inherit rounded-t-[inherit]"
          />

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
    </ui-layout>
  </ui-job-search>
</template>
