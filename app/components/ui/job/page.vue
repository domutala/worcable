<script setup lang="ts">
import type { Job } from "~~/server/database/schema";

const { job } = defineProps<{ job: Job }>();
</script>

<template>
  <div class="flex flex-col gap-5">
    <div>
      <h1 class="text-4xl font-semibold">
        {{ job.title }}
      </h1>
      <div class="">
        {{ job.location }}
      </div>
    </div>

    <div class="">
      <div class="flex flex-wrap gap-2">
        <u-badge
          color="neutral"
          variant="soft"
          size="xl"
          class="bg-surface border-none"
        >
          <u-icon
            :name="
              job.jobNature === 'ONSITE'
                ? 'i-lucide-building-2'
                : job.jobNature === 'REMOTE'
                  ? 'i-lucide-map-pin'
                  : 'i-lucide-map-pin-house'
            "
            sizz="8"
          />
          {{ $t(`job.items.jobNature.types.${job.jobNature}`) }}
        </u-badge>

        <u-badge
          color="neutral"
          variant="soft"
          size="xl"
          class="bg-surface border-none"
        >
          <u-icon name="i-lucide-notebook-text" sizz="8" />
          {{ $t(`job.items.contractType.types.${job.contractType}`) }}
        </u-badge>

        <template v-if="job.salary">
          <u-badge
            color="neutral"
            variant="soft"
            size="xl"
            class="bg-surface border-none"
          >
            <u-icon name="i-lucide-banknote" sizz="8" />
            {{
              Utils.formatCurrency(job.salary.min * 5000, job.salary.currency, {
                locale: $i18n.locale,
                style: "decimal",
              })
            }}
            -
            {{
              Utils.formatCurrency(job.salary.max * 5000, job.salary.currency, {
                locale: $i18n.locale,
                style: "decimal",
              })
            }}

            {{ job.salary.currency }}
          </u-badge>
        </template>
      </div>

      <div v-if="job.skills.length" class="flex flex-wrap gap-1 mt-2">
        <u-badge
          v-for="(skill, s) in job.skills"
          :key="s"
          color="neutral"
          variant="soft"
          size="xl"
          class="bg-surface border-none"
        >
          {{ skill }}
        </u-badge>
      </div>
    </div>

    <div>
      <h2 class="text-lg font-bold mb-2">
        {{ $t("job.items.jobDescription.label") }}
      </h2>
      <ui-editor :model-value="job.jobDescription" :editable="false" />
    </div>

    <div v-if="job.companyDescription">
      <h2 class="text-lg font-bold mb-2">
        {{ $t("job.items.companyDescription.label") }}
      </h2>
      <ui-editor :model-value="job.companyDescription" :editable="false" />
    </div>
  </div>
</template>
