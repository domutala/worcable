<script setup lang="ts">
import type { IModalOptions } from "~/interfaces";
import type { User } from "~~/server/database/collections";
import type { IDataResult } from "~~/server/interfaces";
import { watchArray } from "@vueuse/core";

const emit = defineEmits<(e: "select", user: User) => void>();

const { modal } = defineProps<{ modal?: IModalOptions }>();
const { open, uid } = useModal(modal);

const searchTerm = ref("");
const page = ref(1);
const pageSize = ref(8);
const result = ref<IDataResult<User>>();
const fetching = ref(false);

watchArray([page, pageSize, searchTerm, open], getUsers);
async function getUsers() {
  if (!open.value) {
    result.value = undefined;
    page.value = 1;
    pageSize.value = 8;
    searchTerm.value = "";
    fetching.value = false;
    return;
  }

  fetching.value = true;

  try {
    const query = {
      page: page.value,
      pageSize: pageSize.value,
      q: searchTerm.value,
    };

    result.value = await Api.$fetch<any>("/api/admin/user", { query });
  } finally {
    fetching.value = false;
  }
}

function select(user: User) {
  emit("select", user);
}
</script>

<template>
  <ui-modal-2 v-bind="modal" v-bind:uid="uid" :ui="{ content: 'max-w-3xl' }">
    <template #content>
      <ui-layout-inset :ui="{ content: 'lg:m-0!' }">
        <div v-if="result" class="divide-y divide-default">
          <div class="raltive">
            <u-input
              v-model="searchTerm"
              :ui="{
                base: 'h-full ring-0! bg-transparent pl-13',
                trailing: 'pr-5',
              }"
              :placeholder="$t('user.labels.search_users')"
              icon="i-lucide-search"
              type="search"
              class="h-17 w-full outline-none"
              size="xl"
            >
            </u-input>
          </div>

          <div
            v-if="!result.items.length"
            class="max-w-lg mx-auto text-center py-30"
          >
            <u-icon name="i-lucide-users-round" class="size-10" />
            <p>
              {{ $t("user.labels.empty_search") }}
            </p>
          </div>

          <div
            v-for="user in result.items"
            :key="user.id"
            class="w-full bg-default overflow-hidden group hover:bg-surface/10 flex items-center gap-4 p-3 cursor-pointer"
            @click="select(user)"
          >
            <UAvatar
              :src="Doc.getUrl(user.avatar)"
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
          </div>

          <div
            v-if="result.items.length"
            class="sticky bottom-0 z-20 bg-default"
          >
            <div class="flex items-center gap-5 py-2 px-5">
              {{ (result.page - 1) * result.pageSize + result.items.length }}
              sur
              {{ result.total }}

              <div class="mx-auto"></div>

              <UPagination
                show-edges
                :sibling-count="1"
                variant="ghost"
                color="neutral"
                active-color="neutral"
                active-variant="soft"
                size="sm"
                :page="result.page"
                :items-per-page="result.pageSize"
                :total="result.total"
                :ui="{ item: 'cursor-pointer' }"
                @update:page="(p) => (page = p)"
              />
            </div>
            <u-progress
              v-if="fetching"
              class="absolute top-0 l-0 w-full"
              size="xs"
            />
          </div>
        </div>

        <template v-else-if="fetching">
          <div class="py-24 flex items-center justify-center">
            <u-icon
              name="i-lucide-loader-circle"
              class="animate-spin size-10 mx-auto"
            />
          </div>
        </template>
      </ui-layout-inset>
    </template>
  </ui-modal-2>
</template>
