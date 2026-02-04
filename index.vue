<script lang="ts" setup>
import type { Job } from "~~/server/database/schema";
import _ from "lodash";
import type { Apply } from "~~/server/database/schema";
import type { IDataResult } from "~~/server/interfaces";
import UiLayout from "~/components/layout.vue";
import type { BreadcrumbItem } from "@nuxt/ui";

definePageMeta({ layout: false });

const { job } = defineProps<{ job: Job }>();

const sortBy = ref("updatedAt");
const sortOrder = ref("desc");
const page = ref(1);
const pageSize = ref(9);
const dayjs = useDayjs();

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

const items = ref<BreadcrumbItem[]>([
  {
    label: Use.i18n.t("job.labels.title"),
    icon: "i-lucide-home",
    to: Use.localePath({ name: "admin" }),
  },
  {
    label: job.title,
  },
]);
</script>

<template>
  <u-main class="h-screen bg-default">
    <div v-if="status === 'pending'" class="h-full flex flex-col">
      <ui-skeleton class="relative py-3 px-5 flex items-center bg-">
        <div>
          <ui-skeleton class="h-7 rounded-lg w-70 bg-surface" />
          <ui-skeleton class="h-2 rounded-lg w-30 bg-surface mt-1" />
        </div>

        <ui-skeleton class="h-7 rounded-lg w-40 bg-surface/50 ml-auto" />
      </ui-skeleton>

      <div class="px-5 pt-5">
        <div class="mb-3 flex items-center gap-3">
          <ui-skeleton class="h-12 rounded-xl w-50 bg-surface/50" />

          <div class="mx-auto"></div>

          <ui-skeleton class="h-7 rounded-3xl w-15 bg-surface/50" />
          <ui-skeleton class="h-12 rounded-3xl w-35 bg-surface/50" />
        </div>

        <div class="flex gap-2">
          <div
            v-for="i in 5"
            :key="i"
            class="w-1/5 min-w-80 relative rounded-2xl overflow-hidden border-default h-max"
            :style="{ height: `${Math.random() * (750 - 380) + 380}px` }"
          >
            <ui-skeleton class="absolute! inset-0" />
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="applys" class="h-full flex flex-col mx-auto">
      <ui-job-header :applys :job />

      <div
        class="bg-surface flex-1 mx-2 mb-2 rounded-2xl overflow-auto border border-default"
      >
        <div
          class="sticky top-0 z-50 backdrop-blur-2xl bg-surface/10 px-5 py-2 border-b border-default"
        >
          <UBreadcrumb :items="items" />
        </div>

        <div class="m-10">
          <div class="flex mb-3">
            <div>
              <u-button class="rounded-2xl px-5 py-3" size="xl">
                Ajouter une candidature
              </u-button>
            </div>

            <div class="mx auto"></div>

            <div class="flex items-center gap-2 ml-auto">
              <ui-apply-candate-group
                class="bg-default rounded-xl border border-default"
                :job
              />
            </div>
          </div>

          <div class="mx-auto w-full overflow-hidden rounded-2xl">
            <ui-apply-kanban :job class="pb-5 overflow-x-auto mx-auto" />
          </div>
        </div>
      </div>
    </div>
  </u-main>
</template>
