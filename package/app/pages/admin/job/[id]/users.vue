<script lang="ts" setup>
import type { JobUser, User as _User } from "~~/server/database/collections";
import type { IDataResult } from "~~/server/interfaces";
import { watchArray, watchImmediate } from "@vueuse/core";

type User = _User & { jobUser: JobUser };

const { id: jobID } = defineProps<{ id: string }>();
const searchTerm = ref("");
const page = ref(1);
const pageSize = ref(8);

const {} = useJob(jobID, {
  onReady() {
    setTimeout(() => {
      loadData();
    }, 10);
  },
});
const { open: addUserOpen } = useModal({ uid: "job-user-add" });

const data = ref<IDataResult<User>>();
const loading = ref(false);

watchArray([page, pageSize, searchTerm], loadData);
async function loadData() {
  loading.value = true;
  try {
    const query = {
      page: page.value,
      pageSize: pageSize.value,
      q: searchTerm.value,
    };

    data.value = await Api.$fetch<IDataResult<User>>(
      `/api/admin/job/${jobID}/user`,
      { query },
    );
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div
    class="flex items-center gap-2 sticky top-0 z-50 backdrop-blur-2xl bg-default/50 py-1 px-1"
  >
    <u-button
      icon="i-lucide-arrow-left"
      size="sm"
      variant="ghost"
      @click="$router.back()"
    ></u-button>

    {{ $t("job_user.labels.users") }}
  </div>

  <div
    ref="container"
    class="overflow-hidden lg:rounded border border-default w-full lg:w-250 mx-auto max-h-full flex-col flex lg:my-10"
  >
    <div class="scroller flex flex-col overflow-auto">
      <div class="flex flex-col flex-1 divide-y divide-default">
        <template v-if="data">
          <div class="relative group">
            <u-input
              v-model="searchTerm"
              :ui="{
                base: 'h-full ring-0! bg-transparent pl-13',
                trailing: 'pr-5',
              }"
              :placeholder="$t('apply.actions.search_candidate')"
              icon="i-lucide-search"
              type="search"
              class="h-17 w-full outline-none"
              size="xl"
            >
            </u-input>

            <div
              class="absolute right-0 top-1/2 -translate-y-1/2 px-2 flex items-center gap-2 group-focus-within:hidden"
            >
              <u-button
                icon="i-lucide-user-round-plus"
                variant="solid"
                size="md"
                color="success"
                @click="addUserOpen = true"
              >
                {{ $t("job_user.labels.add_user") }}
              </u-button>

              <u-button
                icon="i-lucide-refresh-cw"
                variant="ghost"
                size="sm"
                :loading
                squre
                @click="loadData"
              >
              </u-button>
            </div>
          </div>

          <div
            v-if="!data.items.length"
            class="max-w-lg mx-auto text-center py-30"
          >
            <u-icon name="i-lucide-users-round" class="size-10" />
            <p>
              {{ $t("apply.labels.no_apply") }}
            </p>
          </div>

          <div
            v-for="(user, i) in data.items"
            :key="user.id"
            class="w-full bg-default overflow-hidden group hover:bg-surface/10"
          >
            <div
              class="flex items-center gap-4 p-5 relative border-default w-full text-left"
            >
              <UAvatar
                :src="Utils.getFileUrl(user.avatar)"
                :alt="[user.firstName, user.lastName].join(' ')"
                class="border border-accented rounded-2xl text-md"
                size="3xl"
              />

              <div class="leading-[1.1] flex-1 min-w-0 w-0">
                <div class="font-bold truncate">
                  {{ user.firstName }}
                  {{ user.lastName }}
                </div>

                <div class="text-sm opacity-50">
                  {{ user.email }}
                </div>
              </div>

              <ui-job-user-status v-model:job-user="user.jobUser" />
              <ui-job-user-remove
                v-model:job-user="user.jobUser"
                @remove="data.items.splice(i, 1)"
              />
            </div>
          </div>

          <div v-if="data.items.length" class="sticky bottom-0 z-20 bg-default">
            <div class="flex items-center gap-5 py-2 px-5">
              {{ (data.page - 1) * data.pageSize + data.items.length }} sur
              {{ data.total }}

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
            </div>
            <u-progress
              v-if="loading"
              class="absolute top-0 l-0 w-full"
              size="xs"
            />
          </div>
        </template>

        <template v-else-if="loading">
          <ui-skeleton
            v-for="i in 5"
            :key="i"
            class="h-20 w-full border-default bg-default/70"
          >
          </ui-skeleton>
        </template>
      </div>
    </div>
  </div>
</template>
