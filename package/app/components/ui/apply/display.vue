<script lang="ts" setup>
import type { Apply, Job } from "~~/server/database/collections";
import _ from "lodash";

const job = defineModel<Job>("job", { required: true });
const apply = defineModel<Apply>("apply", { required: true });
</script>

<template>
  <!-- <div class="flex items-center gap-2 px-5 py-5 border-b-0">
    <UAvatar
      :src="
        apply.data.avatar ? `/api/file/${apply.data.avatar.data}` : undefined
      "
      :alt="[apply.data.firstName, apply.data.lastName].join(' ')"
      class="pointer-events-none! border border-accented rounded-2xl text-md"
      size="3xl"
    />

    <div class="select-none leading-[1.1]">
      <div class="pointer-events-none! font-bold">
        {{ apply.data.firstName }}
        {{ apply.data.lastName }}
      </div>

      <div>
        {{ Utils.getDateStatus(apply.createdAt) }}
      </div>
    </div>

    <div class="flex items-center gap-2 relative ml-auto">
      <ui-apply-note
        v-model:apply="apply"
        v-model:job="job"
        class="pointer-events-auto"
      />
      <ui-apply-status-button v-model:apply="apply" v-model:job="job" />
    </div>
  </div> -->

  <div class="flex flex-col gap-1">
    <div
      class="px-5 py-4 text-sm bg-default rounded-xl flex items-center gap-3 w-full"
    >
      <div>
        <u-icon name="i-lucide-file-text" class="size-8 text-highlighted" />
      </div>

      <div class="leading-[1.1] flex-1 w-0">
        <div class="font-semibold truncate">
          {{ apply.data.cv.filename }}
        </div>
        <div class="text-sm">
          {{ Utils.fileSizeFormat(apply.data.cv.size) }}
        </div>
      </div>

      <div class="ml-auto">
        <u-button
          class="rounded-xl cursor-pointer px-3 py-2"
          color="neutral"
          icon="i-lucide-arrow-down"
          target="_blank"
          variant="soft"
          :href="Doc.getUrl(apply.data.cv)"
          square
        >
          <!-- {{ $t("apply.actions.donwload_cv") }} -->
        </u-button>
      </div>
    </div>

    <div class="px-5 py-4 text-sm bg-default rounded-xl">
      <h2 class="text- font-bold truncate">
        {{ $t("apply.items.firstName.label") }}
      </h2>
      <div>
        {{ apply.data.firstName }}
      </div>
    </div>

    <div class="px-5 py-4 text-sm bg-default rounded-xl">
      <h2 class="text- font-bold">
        {{ $t("apply.items.lastName.label") }}
      </h2>
      <div>
        {{ apply.data.lastName }}
      </div>
    </div>

    <div class="px-5 py-4 text-sm bg-default rounded-xl flex items-center">
      <div>
        <h2 class="text- font-bold">
          {{ $t("apply.items.email.label") }}
        </h2>
        <div>
          {{ apply.data.email }}
        </div>
      </div>

      <div class="ml-auto">
        <UButton
          color="neutral"
          icon="i-lucide-mail-plus"
          target="_blank"
          class="rounded-3xl"
          variant="soft"
          :href="`mailto:${apply.data.email}`"
        >
        </UButton>
      </div>
    </div>

    <div class="px-5 py-4 text-sm bg-default rounded-xl flex items-center">
      <div>
        <h2 class="text- font-bold">
          {{ $t("apply.items.phone.label") }}
        </h2>
        <div>
          {{ apply.data.phone }}
        </div>
      </div>

      <div class="ml-auto">
        <UButton
          color="neutral"
          icon="i-lucide-phone-outgoing"
          target="_blank"
          class="rounded-3xl"
          variant="soft"
          :href="`tel:${apply.data.phone}`"
        >
        </UButton>
      </div>
    </div>

    <div class="px-5 py-4 text-sm bg-default rounded-xl">
      <h2 class="text- font-bold">
        {{ $t("apply.items.educationLevel.label") }}
      </h2>
      {{ $t(`apply.items.educationLevel.items.${apply.data.educationLevel}`) }}
    </div>

    <div class="px-5 py-4 text-sm bg-default rounded-xl">
      <h2 class="text- font-bold">
        {{ $t("apply.items.availability.label") }}
      </h2>
      {{ $t(`apply.items.availability.items.${apply.data.availability}`) }}
    </div>

    <div class="px-5 py-4 text-sm bg-default rounded-xl">
      <h2 class="text- font-bold">
        {{ $t("apply.items.desiredGrossSalary.label") }}
      </h2>

      {{
        Utils.formatCurrency(apply.data.desiredGrossSalary, "EUR", {
          style: "currency",
          locale: $i18n.locale,
        })
      }}
    </div>

    <div v-if="apply.data.motivation" class="w-full mt-3 px-2">
      <h2 class="text- font-bold">
        {{ $t("apply.items.motivation.label") }}
      </h2>

      <ui-editor
        v-model="apply.data.motivation"
        :editable="false"
        :placeholder="$t('job.items.jobDescription.label')"
        class="max-h-100 overflow-y-auto w-full"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content {
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgb(73, 73, 73);
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
}
</style>
