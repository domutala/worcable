<script lang="ts" setup>
import _ from "lodash";
import type { Apply } from "~~/server/database/schema";
import type { IDataResult } from "~~/server/interfaces";

const sortBy = ref("updatedAt");
const sortOrder = ref("desc");
const page = ref(1);
const pageSize = ref(9);

const {
  data: applys,
  status,
  refresh,
} = await useFetch<IDataResult<Apply>>(`/api/admin/apply`, {
  method: "get",
  query: { sortBy, sortOrder, page, pageSize },
  watch: [sortBy, sortOrder, page, pageSize],
});

const applysGroup = computed(() => {
  if (!applys.value) return {};

  return _.groupBy(applys.value.items, "status");
});
</script>

<template>
  <div class="h-screen bg-primary/7">
    <div class="h-full flex flex-col mx-auto">
      <div class="py-3 px-5 mb-10 flex bg-default">
        <div class="leading-none">
          <h1 class="text-xl font-bold">
            Lorem ipsum dolor sit amet consectetur
          </h1>
          <div>Dakar</div>
        </div>

        <div class="mx-auto"></div>

        <div>
          <UAvatarGroup
            size="md"
            :max="3"
            class="rounded-3xl border border-default p-3 py-2 bg-default"
          >
            <UAvatar
              src="https://github.com/benjamincanac.png"
              alt="Benjamin Canac"
            />
            <UAvatar src="https://github.com/romhml.png" alt="Romain Hamel" />
            <UAvatar src="https://github.com/noook.png" alt="Neil Richter" />
            <UAvatar src="https://github.com/romhml.png" alt="Romain Hamel" />
            <UAvatar src="https://github.com/noook.png" alt="Neil Richter" />
          </UAvatarGroup>
        </div>
      </div>

      <div class="flex-1 overflow-auto px-5">
        <ui-kanban v-if="applys" :applys class="mx-auto" />
      </div>
      <div class="h-10"></div>
    </div>
  </div>
</template>
