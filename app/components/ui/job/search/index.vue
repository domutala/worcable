<script lang="ts" setup>
import type { Job } from "~~/server/database/schema";
import type { IDataResult } from "~~/server/interfaces";
import { watchImmediate } from "@vueuse/core";
import _ from "lodash";
import { useRouteQuery } from "@vueuse/router";

definePageMeta({ layout: false });

const searchQuery = useRouteQuery("q", "", { transform: String });
const sortBy = ref("updatedAt");
const sortOrder = ref("desc");
const page = useRouteQuery("page", "1", { transform: Number });
const pageSize = ref(8);

const {
  data: results,
  status,
  refresh,
} = await useFetch<IDataResult<Job>>(`/api/job`, {
  method: "get",
  query: {
    sortBy,
    sortOrder,
    page,
    pageSize,
    q: searchQuery,
  },
  watch: [sortBy, sortOrder, page, pageSize, searchQuery],
});

const jobs = defineModel<Job[]>("jobs", { default: [] });

watch(
  () => searchQuery.value,
  () => {
    jobs.value = [];
  },
);

watchImmediate(
  () => results.value,
  () => {
    if (results.value?.items.length) {
      jobs.value.push(..._.cloneDeep(results.value.items));
      jobs.value = _.uniqBy(jobs.value, "id");
    }
  },
  { deep: true },
);

function paginate(p: number) {
  page.value = p;
}
</script>

<template>
  <slot :results :status :refresh :jobs :page :paginate />
</template>
