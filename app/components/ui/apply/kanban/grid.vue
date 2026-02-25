<script lang="ts" setup>
import { type Apply, type Job } from "~~/server/database/schema";
import type { IDataResult } from "~~/server/interfaces";
import Sortable from "sortablejs";
import _ from "lodash";
import onFetchError from "~/tools/onFetchError";

const status = defineModel<string | null>("status", { required: true });
const job = defineModel<Job>("job", { required: true });
const applyStatus = ref(
  job.value.applyStatus.find((a) => a.key === status.value),
);

const sortBy = ref("updatedAt");
const sortOrder = ref("desc");
const page = ref(1);
const pageSize = ref(8);
const searchTerm = ref("");

const isFlip = useCookie<boolean>(`${job.value.id}_${status.value}`, {
  decode: (value) => (value === "true" ? true : false),
  encode: (value) => String(value),
  default: () => {
    return ["", null].includes(status.value) ? true : false;
  },
});

const dayjs = useDayjs();
const statusChanging = ref<Record<string, string>>({});
const fetching = ref(false);
const container = useTemplateRef("container");
const initFetching = ref(false);
const openSearch = ref(false);

const isApplyStatusEditOpen = ref(false);
const isApplyStatusRemoveOpen = ref(false);

const result = ref<IDataResult<Apply>>();
const applys = ref<Apply[]>([]);

onMounted(async () => {
  window.addEventListener(`${status.value}:actions`, (e: any) =>
    onEventActions(e),
  );
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
    const query = {
      jobID: job.value.id,
      filterBy: `status:${status.value}`,
      page: page.value,
      pageSize: pageSize.value,
      q: searchTerm.value,
    };

    result.value = await $fetch("/api/admin/apply", { query });

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
    const _applys = applys.value.filter(
      (apply) => apply.status !== status.value,
    );

    for (const apply of _applys) {
      dispatchEvent(
        new CustomEvent(`${apply.status}:actions`, {
          detail: { action: "add-apply", apply },
        }),
      );

      dispatchEvent(
        new CustomEvent(`${status.value}:actions`, {
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
    sort: false,

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
          body: { id, to: to ?? null },
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
  <ui-apply-status-display
    v-slot="{ color, label, icon, bgColor, borderColor }"
    v-model:job="job"
    v-model:status="status"
  >
    <div
      class="overflow-hidden relative group rounded mb-3"
      ref="container"
      :data-grid="status"
      :data-group="status"
      :data-status="status"
      :class="{ 'min-w-88.5 w-1/5': !isFlip, 'min-w-21': isFlip }"
    >
      <template v-if="applyStatus">
        <ui-job-apply-status-edit
          v-model:open="isApplyStatusEditOpen"
          v-model:apply-status="applyStatus"
          v-model:job="job"
        />

        <ui-job-apply-status-remove
          v-model:open="isApplyStatusRemoveOpen"
          v-model:apply-status="applyStatus"
          v-model:job="job"
        />
      </template>

      <div
        :class="{ hidden: !isFlip }"
        class="flex flex-col justify-center items-center border border-default gap-2 bg-default py-3 relative group-[.dragging]:border group-[.dragging]:border-accented rounded"
      >
        <div class="mx-auto h-8">
          <u-button
            v-if="status"
            class="grid-handler cursor-grab"
            icon="i-lucide-grip-horizontal"
            variant="ghost"
            color="neutral"
            size="md"
            square
          ></u-button>
        </div>

        <div
          class="rounded relative px-4 py-5"
          :style="{ border: `1px solid ${borderColor}` }"
        >
          <div
            class="absolute inset-0 rounded"
            :style="{ backgroundColor: bgColor }"
          ></div>

          <div class="relative flex flex-col items-center gap-2">
            <u-icon v-if="icon" :name="icon" class="size-6" />

            {{ applys.length }}

            <div style="writing-mode: vertical-rl">
              {{ label }}
            </div>
          </div>
        </div>

        <div class="mx-auto">
          <u-button
            class="cursor-pointer"
            icon="i-lucide-move-diagonal"
            variant="ghost"
            color="neutral"
            size="md"
            square
            @click="isFlip = false"
          ></u-button>
        </div>

        <div
          class="absolute inset-0 bg-inherit group-data-grid-dragging:block hidden z-20 border border-dashed border-primary/50 rounded-[inherit]"
        ></div>
      </div>

      <div
        class="scroller border border-default bg-default rounded group group-[.dragging]:border group-[.dragging]:border-accented backdrop-blur-3xl max-h-full overflow-y-auto overflow-hidden flex flex-col"
        :class="{ hidden: isFlip }"
      >
        <div
          class="px-5 border-default bg-default sticky top-0 z-15 py-3"
          :style="{ borderTopColor: color }"
        >
          <div class="flex items-center gap-2 relative">
            <div v-if="status">
              <u-dropdown-menu
                :content="{ align: 'start' }"
                :items="[
                  {
                    label: $t('words.to_update'),
                    icon: 'i-lucide-pencil-line',
                    class: 'cursor-pointer',
                    onSelect(e) {
                      isApplyStatusEditOpen = true;
                    },
                  },
                  {
                    label: $t('words.to_remove'),
                    icon: 'i-lucide-trash-2',
                    class: 'cursor-pointer',
                    onSelect(e) {
                      isApplyStatusRemoveOpen = true;
                    },
                  },
                ]"
              >
                <u-button
                  class="grid-handler cursor-pointer"
                  icon="i-lucide-ellipsis-vertical"
                  variant="ghost"
                  color="neutral"
                  size="md"
                  square
                >
                </u-button>
              </u-dropdown-menu>
            </div>

            <div
              class="px-3 py-2 rounded-min flex items-center gap-2 leading-none min-w-0"
              :style="{
                backgroundColor: bgColor,
              }"
            >
              <u-icon v-if="icon" :name="icon" class="size-6" />

              <div class="truncate">
                {{ applys.length }}
                {{ label }}
              </div>
            </div>

            <div class="ml-auto flex items-center gap-1">
              <u-button
                icon="i-lucide-user-round-search"
                color="neutral"
                variant="ghost"
                class="cursor-pointer"
                size="md"
                @click="openSearch = true"
                square
              />

              <u-button
                class="cursor-pointer"
                icon="i-lucide-minimize-2"
                variant="ghost"
                color="neutral"
                size="md"
                square
                @click="isFlip = true"
              ></u-button>

              <u-button
                v-if="status"
                class="grid-handler cursor-grab"
                icon="i-lucide-grip-vertical"
                variant="ghost"
                color="neutral"
                size="md"
                square
              ></u-button>
            </div>
          </div>

          <u-input
            v-if="openSearch"
            v-model="searchTerm"
            class="h-17 w-full outline-none absolute inset-0 z-50"
            size="xl"
            autofocus
            :placeholder="$t('apply.actions.search_candidate')"
            :ui="{
              base: 'h-full rounded-0 ring-0! border-b border-default bg-default',
            }"
          >
            <template #trailing>
              <u-button
                icon="i-lucide-x"
                color="neutral"
                variant="soft"
                size="xs"
                class="cursor-pointer rounded-default"
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
            size="xs"
            :ui="{
              base: 'rounded-0!',
              indicator: 'rounded-0!',
            }"
          />
        </div>

        <ul
          class="flex flex-col gap-2 flex-1 pt-3 pb-2 relative"
          :data-status="status"
        >
          <li v-if="initFetching" class="mx-2 relative">
            <ui-skeleton
              class="w-full rounded-xl bg-surface/25"
              :style="{ height: `${Math.random() * (550 - 150) + 150}px` }"
            />
          </li>

          <li v-else-if="!applys.length" class="mx-2 relative">
            <div
              class="content sortable-item rounded overflow-hidden border-default relative bg-surface/35 text-center py-15 ring ring-default/50"
            >
              <u-icon
                name="i-lucide-gallery-vertical-end"
                class="size-24 opacity-25 rotate-z-180 text-primary"
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
              class="absolute inset-0 rounded-min border-primary hidden group-[.ghost]:block bg-surface/35"
            ></div>

            <ui-apply-one
              v-model:apply="applys[i]!"
              v-model:job="job"
              @refesh:apply="
                (v) => {
                  applys[i] = v;
                }
              "
            >
              <ui-apply-kanban-apply
                v-model:apply="applys[i]!"
                v-model:job="job"
                :status-changing="
                  Object.values(statusChanging).includes(apply.id)
                "
              />
            </ui-apply-one>
          </li>

          <div
            v-if="result && result.total && result.page !== result.totalPages"
            class="flex justify-center"
          >
            <u-button
              class="cursor-pointer rounded-max"
              color="neutral"
              variant="ghost"
              :loading="fetching"
              @click="page++"
            >
              {{ $t("words.show_more") }}
            </u-button>
          </div>
        </ul>

        <div
          class="absolute inset-0 bg-inherit group-data-grid-dragging:block hidden z-20 border border-dashed border-primary/50 rounded-[inherit]"
        ></div>
      </div>
    </div>
  </ui-apply-status-display>
</template>
