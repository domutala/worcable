<script lang="ts" setup>
import type { Job } from "~~/server/database/schema";

const { job } = defineProps<{ job: Job }>();
</script>

<template>
  <div
    class="py-4 px-5 flex gap-5 bg-inherit/10 backdrop-blur-lg border-b border-default fixed w-full top-0 z-50"
  >
    <div class="leading-none flex-1 min-w-0 w-0">
      <h1 class="text-lg font-bold truncate">
        {{ job.title }}
      </h1>
      <div class="truncate opacity-50">
        {{ Utils.getDateStatus(job.createdAt) }}
      </div>
    </div>

    <div class="flex items-center ml-auto">
      <u-button size="xl">Postuler</u-button>
    </div>
  </div>

  <div
    class="max-h-190 h-screen flex items-center justify-center relative overflow-hidden text-black z-51"
  >
    <img
      src="https://i.pinimg.com/1200x/5f/eb/b5/5febb5e8286f466ff819dd432147f39a.jpg"
      class="absolute inset-0 z-0 object-cover object-center w-full opacity-99"
    />

    <div class="absolute inset-0 z-1 bg-inherit/10 backdrop-blur-lg"></div>

    <u-container class="relative z-2">
      <h1
        class="text-3xl sm:tex:4xl lg:text-5xl xl:text-6xl font-semibold text-center"
      >
        {{ job.title }}
      </h1>

      <div class="text-center mt-10 flex flex-col gap-5">
        <div>
          {{ job.location }}
        </div>

        <div class="">
          <div class="flex flex-wrap justify-center items-center gap-2">
            <u-badge
              color="neutral"
              variant="subtle"
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
              variant="subtle"
              size="xl"
              class="bg-surface border-none"
            >
              <u-icon name="i-lucide-notebook-text" sizz="8" />
              {{ $t(`job.items.contractType.types.${job.contractType}`) }}
            </u-badge>

            <template v-if="job.salary">
              <u-badge
                color="neutral"
                variant="subtle"
                size="xl"
                class="bg-surface border-none"
              >
                <u-icon name="i-lucide-banknote" sizz="8" />
                {{
                  Utils.formatCurrency(
                    job.salary.min * 5000,
                    job.salary.currency,
                    {
                      locale: $i18n.locale,
                      style: "decimal",
                    },
                  )
                }}
                -
                {{
                  Utils.formatCurrency(
                    job.salary.max * 5000,
                    job.salary.currency,
                    {
                      locale: $i18n.locale,
                      style: "decimal",
                    },
                  )
                }}

                {{ job.salary.currency }}
              </u-badge>
            </template>
          </div>

          <div
            v-if="job.skills.length"
            class="flex justify-center items-center flex-wrap gap-1 mt-2"
          >
            <u-badge
              v-for="(skill, s) in job.skills"
              :key="s"
              color="neutral"
              variant="subtle"
              size="xl"
              class="bg-surface border-none"
            >
              {{ skill }}
            </u-badge>
          </div>
        </div>

        <div>
          <u-button size="xl" color="primary" class="px-4 py-3"
            >Postuler</u-button
          >
        </div>
      </div>
    </u-container>
  </div>

  <u-container class="py-15 max-w-6xl">
    <ui-job-page :job />
  </u-container>
</template>
