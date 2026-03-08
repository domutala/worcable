<script lang="ts" setup>
import { watchImmediate } from "@vueuse/core";
import { useRouteQuery } from "@vueuse/router";

const applyID = useRouteQuery<string | undefined>("modal-apply-id");
const isOpen = ref(false);

const { refresh, apply, loading } = useApply("_MODAL_", {
  onReady() {
    if (!apply.value) applyID.value = undefined;
  },
});

watchImmediate(
  () => applyID.value,
  () => {
    if (!applyID.value) return;

    isOpen.value = true;
    refresh(applyID.value);
  },
);
</script>

<template>
  <ui-modal
    v-if="applyID"
    v-model:open="isOpen"
    :ui="{ content: [loading ? 'max-w-14' : 'max-w-360', 'rounded-2xl'] }"
    @update:open="
      () => {
        applyID = undefined;
      }
    "
  >
    <template #content>
      <div v-if="loading" class="flex items-center justify-center py-2">
        <u-icon name="i-lucide-loader-circle" class="animate-spin size-10" />
      </div>

      <ui-layout-inset v-else-if="apply" class="flex-1">
        <template #header>
          <div
            class="flex items-center gap-2 px-5 pt-3 pb-1 border-b-0 relative"
          >
            <UAvatar
              :src="Utils.getFileUrl(apply.data.avatar)"
              :alt="[apply.data.firstName, apply.data.lastName].join(' ')"
              class="border border-accented rounded-2xl text-md"
              size="3xl"
            />

            <div class="select-none leading-[1.1] flex-1 w-0">
              <div class="font-bold truncate">
                {{ apply.data.firstName }}
                {{ apply.data.lastName }}
              </div>

              <div class="truncate text-sm opacity-50">
                {{ Utils.getDateStatus(apply.createdAt) }}
              </div>
            </div>

            <div class="mx-auto w-10"></div>

            <ui-apply-options :apply-id="applyID" />
          </div>
        </template>

        <u-container class="py-10">
          <div class="flex gap-3 items-center mb-4 px-5">
            <ui-apply-note :apply-id="applyID" readonly />

            <ui-apply-status-button
              v-slot="{ color, label, icon, borderColor, bgColor }"
              :apply-id="applyID"
              readonly
            >
              <div class="flex items-center gap-2 leading-none">
                <u-icon :name="icon" />
                {{ label }}
              </div>
            </ui-apply-status-button>
          </div>

          <div class="grid grid-cols-12 gap-3">
            <div class="lg:col-span-8 col-span-12">
              <ui-apply-comment :apply-id="applyID" />
            </div>

            <div class="hidden lg:block col-span-4 scroller">
              <ui-apply-details :apply-id="applyID" />
            </div>
          </div>
        </u-container>
      </ui-layout-inset>
    </template>
  </ui-modal>
</template>
