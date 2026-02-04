<script lang="ts" setup>
import {
  ApplyStatus,
  ApplyStatusColors,
  type Apply,
  type Job,
} from "~~/server/database/schema";
import type { IDataResult } from "~~/server/interfaces";
import Sortable from "sortablejs";
import _ from "lodash";
import onFetchError from "~/tools/onFetchError";

const { job, status } = defineProps<{ status: ApplyStatus; job: Job }>();

const sortBy = ref("updatedAt");
const sortOrder = ref("desc");
const page = ref(1);
const pageSize = ref(8);

const dayjs = useDayjs();
const statusChanging = ref<Record<string, string>>({});
const fetching = ref(false);
const container = useTemplateRef("container");
const initFetching = ref(false);

const result = ref<IDataResult<Apply>>();
const applys = ref<Apply[]>([]);

onMounted(() => {
  window.addEventListener(`${status}:actions`, (e: any) => onEventActions(e));
});

function onEventActions(e: CustomEvent) {
  if (e.detail.action === "remove-apply") {
    const is = applys.value.findIndex((a) => a.id === e.detail.apply.id);
    if (is !== -1) applys.value.splice(is, 1);
  }
}

onBeforeUnmount(() => {
  window.removeEventListener(`${status}:actions`, (e: any) =>
    onEventActions(e),
  );
});

onMounted(async () => {
  initFetching.value = true;

  try {
    await getApplys();
    setSortable();
  } catch (error) {
    console.log(error);
  } finally {
    initFetching.value = false;
  }
});

watch(() => page.value, getApplys);
async function getApplys() {
  fetching.value = true;

  try {
    result.value = await $fetch(`/api/admin/apply`, {
      method: "get",
      query: {
        jobID: job.id,
        filterBy: `status:${status}`,
        page: page.value,
        pageSize: pageSize.value,
      },
    });

    const r = _.cloneDeep(
      result.value!.items.sort((a, b) => {
        return dayjs(a.updatedAt).isAfter(b.updatedAt) ? -1 : 1;
      }),
    );

    applys.value.push(...r);
    applys.value = _.uniqBy(applys.value, "id");
  } finally {
    fetching.value = false;
  }
}

function setSortable() {
  if (!container.value) return;
  const ul = container.value.querySelector("ul");

  new Sortable(ul!, {
    handle: ".handler",
    group: "shared",
    invertSwap: true,

    chosenClass: "chosen",
    dragClass: "drag",
    ghostClass: "ghost",
    swapClass: "swap",
    selectedClass: "selected",
    fallbackClass: "fallback",

    async onAdd(event) {
      const id = event.item.getAttribute("data-id");
      const to = event.to.getAttribute("data-status");
      const from = event.from.getAttribute("data-status");

      if (!id) return;

      const loadID = Math.random().toString().substring(3, 20);
      statusChanging.value[loadID] = id;

      try {
        const result = await $fetch<Apply>(`/api/admin/apply/${id}/status`, {
          method: "patch",
          body: { id, to },
        });
        const lis = ul!.querySelectorAll("li[data-id]");
        lis.forEach((li, index) => {
          if (li.getAttribute("data-id") === result.id) {
            const is = applys.value.findIndex(
              (a) => a.id === li.getAttribute("data-id"),
            );

            if (is === -1) applys.value.splice(index, 0, result);

            dispatchEvent(
              new CustomEvent(`${from}:actions`, {
                detail: { action: "remove-apply", apply: result },
              }),
            );
          }
        });
      } catch (error) {
        onFetchError(error);
      } finally {
        delete statusChanging.value[loadID];
      }
    },
  });
}
</script>

<template>
  <div
    ref="container"
    :data-group="status"
    :data-status="status"
    :style="{ width: `calc(1/${Object.keys(ApplyStatus).length} * 100%)` }"
    class="kanban group border-default backdrop-blur-3xl h-max min-w-80 overflow-y-auto overflow-hidden flex flex-col rounded-2xl bg-default"
  >
    <div
      class="px-5 border-default bg-default sticky top-0 z-15 py-3"
      :style="{ borderTopColor: ApplyStatusColors[status] }"
    >
      <div class="flex items-center gap-2 relative">
        <div
          class="rounded-2xl relative px-4 py-2 flex items-center gap-2 text-highlighted"
        >
          <div
            class="absolute inset-0 opacity-12 rounded-2xl"
            :style="{ backgroundColor: ApplyStatusColors[status] }"
          ></div>

          <u-icon
            :name="$t(`apply.status.${status}.icon`)"
            class="size-5"
            :style="{ color: ApplyStatusColors[status] }"
          />

          {{ $t(`apply.status.${status}.label`) }}
        </div>

        <div class="ml-auto">
          {{ applys.length }}
        </div>
      </div>
    </div>

    <ul class="flex flex-col gap-2 flex-1 py-3 relative" :data-status="status">
      <li v-if="initFetching" class="mx-2 relative">
        <ui-skeleton
          class="w-full rounded-xl bg-surface/50"
          :style="{ height: `${Math.random() * (550 - 150) + 150}px` }"
        />
      </li>

      <li v-else-if="!applys.length" class="mx-2 relative">
        <div
          class="content sortable-item rounded-xl overflow-hidden border-default relative bg-surface h-35"
        ></div>
      </li>

      <li
        v-for="apply in applys || []"
        :key="apply.id"
        :data-id="apply.id"
        class="mx-2 apply relative group"
      >
        <div
          class="absolute inset-0 rounded-xl border-primary hidden group-[.ghost]:block bg-surface"
        ></div>

        <ui-admin-apply-kanban-apply
          :job
          :apply
          :status-changing="Object.values(statusChanging).includes(apply.id)"
        />
      </li>

      <div
        v-if="result && result.total && result.page !== result.totalPages"
        class="flex justify-center"
      >
        <u-button
          class="cursor-pointer rounded-4xl"
          color="neutral"
          variant="ghost"
          icon="i-lucide-list-filter-plus"
          :loading="fetching"
          @click="page++"
        >
          {{ $t("words.show_more") }}
        </u-button>
      </div>
    </ul>
  </div>
</template>
