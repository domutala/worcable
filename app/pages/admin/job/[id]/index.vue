<script lang="ts" setup>
import type { Job } from "~~/server/database/schema";
import _ from "lodash";
import type { Apply } from "~~/server/database/schema";
import type { IDataResult } from "~~/server/interfaces";
import UiLayout from "~/components/layout.vue";

definePageMeta({ layout: false });

const job = defineModel<Job>({ required: true });
const sortBy = ref("updatedAt");
const sortOrder = ref("desc");
const page = ref(1);
const pageSize = ref(9);
const dayjs = useDayjs();
const side = ref("kanban");

const { data, status, refresh } = await useFetch<IDataResult<Apply>>(
  `/api/admin/job/${Use.route.params.id}/applys`,
  {
    method: "get",
    query: { sortBy, sortOrder, page, pageSize },
    watch: [sortBy, sortOrder, page, pageSize],
  },
);

const applys = ref(
  _.cloneDeep(
    data.value?.items.sort((a, b) => {
      return dayjs(a.updatedAt).isAfter(b.updatedAt) ? -1 : 1;
    }) || [],
  ),
);
</script>

<template>
  <ui-layout>
    <template #header>
      <ui-job-header :applys :job />
    </template>

    <div class="overflow-auto h-full flex flex-col">
      <div v-if="status === 'pending'" class="px-5 pt-5">
        <div class="mb-3 flex items-center gap-3">
          <ui-skeleton class="h-12 rounded-xl w-50 bg-default/50" />

          <div class="mx-auto"></div>

          <ui-skeleton class="h-7 rounded-3xl w-15 bg-default/50" />
          <ui-skeleton class="h-12 rounded-3xl w-35 bg-default/50" />
        </div>

        <div class="flex gap-2">
          <div
            v-for="i in 5"
            :key="i"
            class="w-1/5 min-w-80 relative rounded-2xl overflow-hidden border-default h-max"
            :style="{ height: `${Math.random() * (750 - 380) + 380}px` }"
          >
            <ui-skeleton class="absolute! inset-0 bg-default/50" />
          </div>
        </div>
      </div>

      <template v-else>
        <UiBreadcrumb :breads="['$home', '$admin', { label: job.title }]" />

        <div class="flex mx-auto w-420 max-w-full pb-2 pt-10 px-5">
          <ui-apply-candate-group
            class="bg-default rounded-xl border border-default"
            :job
          />

          <div class="flex items-center gap-2">
            <div
              class="bg-default rounded-xl border border-default p-2 h-full flex gap-2 items-center"
            >
              <u-button
                :class="{ 'bg-accented': side === 'kanban' }"
                icon="i-lucide-kanban"
                class="cursor-pointer"
                color="neutral"
                variant="ghost"
                square
                @click="side = 'kanban'"
              >
              </u-button>
              <u-button
                :class="{ 'bg-accented': side === 'list' }"
                icon="i-lucide-text"
                class="cursor-pointer"
                color="neutral"
                variant="ghost"
                square
                @click="side = 'list'"
              >
              </u-button>
            </div>
          </div>

          <div class="mx-auto"></div>

          <div class="hidden">
            <u-button
              class="rounded-2xl px-5 py-3"
              size="lg"
              icon="i-lucide-user-round-plus"
            >
              {{ $t("job.actions.add_new_apply") }}
            </u-button>
          </div>
        </div>

        <ui-apply-kanban
          v-if="side === 'kanban'"
          v-model:job="job"
          class="mx-auto max-w-full w-420 px-1 sm:px-5"
        />

        <ui-apply-list
          v-else
          v-model:job="job"
          class="mx-auto max-w-full w-420 px-1 sm:px-5"
        />
      </template>
    </div>
  </ui-layout>
</template>
