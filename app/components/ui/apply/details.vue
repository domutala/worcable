<script lang="ts" setup>
import type { Apply, Job } from "~~/server/database/schema";
import _ from "lodash";

const job = defineModel<Job>("job", { required: true });
const apply = defineModel<Apply>("apply", { required: true });
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <div
      class="px-5 py-4 text-sm bg-default rounded-min ring ring-default flex items-center gap-3 w-full"
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
          class="rounded-default cursor-pointer px-3 py-2"
          color="neutral"
          icon="i-lucide-arrow-up-right"
          target="_blank"
          variant="soft"
          :href="Utils.getFileUrl(apply.data.cv)"
          square
        >
          <!-- {{ $t("apply.actions.donwload_cv") }} -->
        </u-button>
      </div>
    </div>

    <div class="px-5 py-4 text-sm bg-default rounded-min ring ring-default">
      <h2 class="text- font-bold truncate">
        {{ $t("apply.items.firstName.label") }}
      </h2>
      <div>
        {{ apply.data.firstName }}
      </div>
    </div>

    <div class="px-5 py-4 text-sm bg-default rounded-min ring ring-default">
      <h2 class="text- font-bold">
        {{ $t("apply.items.lastName.label") }}
      </h2>
      <div>
        {{ apply.data.lastName }}
      </div>
    </div>

    <div
      class="px-5 py-4 text-sm bg-default rounded-min ring ring-default flex items-center"
    >
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
          class="rounded-default"
          size="lg"
          variant="soft"
          :href="`mailto:${apply.data.email}`"
          square
        >
        </UButton>
      </div>
    </div>

    <div
      class="px-5 py-4 text-sm bg-default rounded-min ring ring-default flex items-center"
    >
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
          class="rounded-default"
          size="lg"
          variant="soft"
          :href="`tel:${apply.data.phone}`"
          square
        >
        </UButton>
      </div>
    </div>

    <div class="px-5 py-4 text-sm bg-default rounded-min ring ring-default">
      <h2 class="text- font-bold">
        {{ $t("apply.items.educationLevel.label") }}
      </h2>
      {{ $t(`apply.items.educationLevel.items.${apply.data.educationLevel}`) }}
    </div>

    <div class="px-5 py-4 text-sm bg-default rounded-min ring ring-default">
      <h2 class="text- font-bold">
        {{ $t("apply.items.availability.label") }}
      </h2>
      {{ $t(`apply.items.availability.items.${apply.data.availability}`) }}
    </div>

    <div class="px-5 py-4 text-sm bg-default rounded-min ring ring-default">
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

    <div
      v-if="apply.data.motivation"
      class="w-full px-5 py-4 rounded-default bg-default"
    >
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
