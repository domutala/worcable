<script lang="ts" setup>
import type { Apply, ApplyComment, Job } from "~~/server/database/schema";
import _ from "lodash";
import type { IDataResult } from "~~/server/interfaces";
import { watchImmediate } from "@vueuse/core";

const job = defineModel<Job>("job", { required: true });
const apply = defineModel<Apply>("apply", { required: true });

const searchTerm = ref("");
const sortBy = ref("updatedAt");
const sortOrder = ref("desc");
const page = ref(1);
const pageSize = ref(8);
const filterBy = ref<`${string}:${string}` | null>(null);

const { data, status, refresh } = await useFetch<IDataResult<ApplyComment>>(
  `/api/admin/apply/${apply.value.id}/comment`,
  {
    method: "get",
    query: { sortBy, sortOrder, page, pageSize, filterBy, q: searchTerm },
    watch: [sortBy, sortOrder, page, pageSize, filterBy, searchTerm],
  },
);

const comments = defineModel<ApplyComment[]>("comments", { default: [] });

watchImmediate(
  () => data.value,
  () => {
    if (!data.value) return;
    comments.value.push(...data.value.items);
  },
  { deep: true },
);
</script>

<template>
  <div class="space-y-3">
    <template v-if="!data && status === 'pending'">
      <div v-for="i in 4" :key="i" class="p-5 relative">
        <ui-skeleton
          class="rounded-xl absolute! inset-0 size-full bg-default/30"
        />

        <div class="mb-3 flex items-center gap-3">
          <div>
            <ui-skeleton class="rounded-xl size-12 bg-default/50" />
          </div>
          <div>
            <ui-skeleton class="h-5 rounded-3xl w-35 bg-default/50" />
            <ui-skeleton class="h-3 rounded-3xl w-15 bg-default/50 mt-1" />
          </div>

          <div class="mx-auto"></div>
        </div>

        <div>
          <ui-skeleton
            v-for="i in 5"
            class="h-4 rounded-3xl w-15 bg-default/50 mb-1"
            :style="{ width: `${Math.random() * (60 - 100) + 100}%` }"
          />
        </div>
      </div>
    </template>

    <ui-apply-comment-one
      v-for="comment in comments"
      v-model:apply="apply"
      v-model:job="job"
      :key="comment.id"
      :comment
    >
    </ui-apply-comment-one>

    <div v-if="data && data.total" class="flex items-center gap-3 px-3">
      <template v-if="data?.items.length">
        {{ (data.page - 1) * data.pageSize + data.items.length }}
        {{ $t("words.on") }}
        {{ data.total }}
      </template>

      <u-button
        v-if="data.page !== data.totalPages"
        class="cursor-pointer rounded-lg px-3 bg-default"
        color="neutral"
        variant="ghost"
        :loading="status === 'pending'"
        @click="page++"
      >
        {{ $t("words.show_more") }}
      </u-button>
    </div>
  </div>
</template>
