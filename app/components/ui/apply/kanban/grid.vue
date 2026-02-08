<script lang="ts" setup>
import { type Apply, type Job } from "~~/server/database/schema";
import type { IDataResult } from "~~/server/interfaces";
import Sortable from "sortablejs";
import _ from "lodash";
import onFetchError from "~/tools/onFetchError";
import { ApplyStatus } from "~~/server/services/apply_get_shema";
import { applyStatusColors } from "~/tools/apply";

const { status } = defineProps<{ status: ApplyStatus; job: Job }>();
const job = defineModel<Job>("job", { required: true });

const sortBy = ref("updatedAt");
const sortOrder = ref("desc");
const page = ref(1);
const pageSize = ref(8);
const searchTerm = ref("");

const dayjs = useDayjs();
const statusChanging = ref<Record<string, string>>({});
const fetching = ref(false);
const container = useTemplateRef("container");
const initFetching = ref(false);
const openSearch = ref(false);

const result = ref<IDataResult<Apply>>();
const applys = ref<Apply[]>([]);

onMounted(async () => {
  window.addEventListener(`${status}:actions`, (e: any) => onEventActions(e));
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

function onEventActions(e: CustomEvent) {
  if (e.detail.action === "remove-apply") {
    const is = applys.value.findIndex((a) => a.id === e.detail.apply.id);
    if (is !== -1) applys.value.splice(is, 1);
  } else if (e.detail.action === "add-apply") {
    const is = applys.value.findIndex((a) => a.id === e.detail.apply.id);
    if (is === -1) applys.value.push(e.detail.apply);
  }
}

onBeforeUnmount(() => {
  window.removeEventListener(`${status}:actions`, (e: any) =>
    onEventActions(e),
  );
});

watch(() => page.value, getApplys);
watch(() => searchTerm.value, getApplys);
async function getApplys() {
  fetching.value = true;

  try {
    result.value = await $fetch("/api/admin/apply", {
      query: {
        jobID: job.value.id,
        filterBy: `status:${status}`,
        page: page.value,
        pageSize: pageSize.value,
        q: searchTerm.value,
      },
    });

    const r = _.cloneDeep(
      result.value!.items.sort((a, b) => {
        return dayjs(a.updatedAt).isAfter(b.updatedAt) ? -1 : 1;
      }),
    );

    if (searchTerm.value) applys.value = r;
    else applys.value.push(...r);

    applys.value = _.uniqBy(applys.value, "id");
  } finally {
    fetching.value = false;
  }
}

watch(
  () => applys.value,
  () => {
    const _applys = applys.value.filter((apply) => apply.status !== status);

    for (const apply of _applys) {
      dispatchEvent(
        new CustomEvent(`${apply.status}:actions`, {
          detail: { action: "add-apply", apply },
        }),
      );

      dispatchEvent(
        new CustomEvent(`${status}:actions`, {
          detail: { action: "remove-apply", apply },
        }),
      );
    }
  },
  { deep: true },
);

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
    class="overflow-hidden min-w-80 rounded-2xl"
    :style="{ width: `calc(1/${Object.keys(ApplyStatus).length} * 100%)` }"
  >
    <div
      ref="container"
      :data-group="status"
      :data-status="status"
      class="kanban group border-default backdrop-blur-3xl max-h-full overflow-y-auto overflow-hidden flex flex-col bg-default rounded-2xl"
    >
      <div
        class="px-5 border-default bg-default sticky top-0 z-15 py-3"
        :style="{ borderTopColor: applyStatusColors[status] }"
      >
        <div class="flex items-center gap-2 relative">
          <div
            class="rounded-2xl relative px-4 py-2 flex items-center gap-2 text-highlighted"
          >
            <div
              class="absolute inset-0 opacity-12 rounded-2xl"
              :style="{ backgroundColor: applyStatusColors[status] }"
            ></div>

            <u-icon
              :name="$t(`apply.status.${status}.icon`)"
              class="size-5"
              :style="{ color: applyStatusColors[status] }"
            />

            {{ applys.length }}

            {{ $t(`apply.status.${status}.label`) }}
          </div>

          <div class="ml-auto">
            <u-button
              icon="i-lucide-user-round-search"
              color="neutral"
              variant="ghost"
              class="cursor-pointer"
              @click="openSearch = true"
              square
            />
          </div>
        </div>

        <u-input
          v-if="openSearch"
          v-model="searchTerm"
          icon="i-lucide-user-round-search"
          class="h-17 w-full outline-none absolute inset-0"
          size="xl"
          autofocus
          :placeholder="$t('apply.actions.search_candidate')"
          :ui="{ base: 'h-full rounded-0 ring-0! border-b border-default' }"
        >
          <template #trailing>
            <u-button
              icon="i-lucide-x"
              color="neutral"
              variant="subtle"
              size="xs"
              class="cursor-pointer rounded-4xl"
              @click="
                openSearch = false;
                searchTerm = '';
              "
              square
            />
          </template>
        </u-input>

        <u-progress
          v-if="fetching"
          class="absolute bottom-0 left-0 rounded-0"
          :ui="{
            base: 'rounded-0!',
            indicator: 'rounded-0!',
          }"
        />
      </div>

      <ul
        class="flex flex-col gap-2 flex-1 py-3 relative"
        :data-status="status"
      >
        <li v-if="initFetching" class="mx-2 relative">
          <ui-skeleton
            class="w-full rounded-xl bg-surface/50"
            :style="{ height: `${Math.random() * (550 - 150) + 150}px` }"
          />
        </li>

        <li v-else-if="!applys.length" class="mx-2 relative">
          <div
            class="content sortable-item rounded-xl overflow-hidden border-default relative bg-surface text-center py-15"
          >
            <u-icon
              name="i-lucide-gallery-vertical-end"
              class="size-24 opacity-25 rotate-z-180"
            />
          </div>
        </li>

        <li
          v-for="(apply, i) in applys"
          :key="apply.id"
          :data-id="apply.id"
          class="mx-2 apply relative group"
        >
          <div
            class="absolute inset-0 rounded-xl border-primary hidden group-[.ghost]:block bg-surface"
          ></div>

          <ui-apply-kanban-apply
            v-model:apply="applys[i]!"
            v-model:job="job"
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
  </div>
</template>
