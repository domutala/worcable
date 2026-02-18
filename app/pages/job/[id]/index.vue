<script lang="ts" setup>
import type { Job } from "~~/server/database/schema";

definePageMeta({ layout: false });

const { job } = defineProps<{ job: Job }>();
const apply = useTemplateRef("apply");
</script>

<template>
  <div
    class="py-4 px-5 flex gap-5 bg-inherit/10 backdrop-blur-lg fixed w-full top-0 z-50"
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
      <u-button
        size="xl"
        class="cursor-pointer"
        @click="apply?.scrollIntoView({ behavior: 'smooth' })"
      >
        {{ $t("apply.actions.apply") }}
      </u-button>
    </div>
  </div>

  <div
    class="max-h-190 h-screen flex items-center justify-center relative overflow-hidden z-51 backdrop-blur-3xl bg-linear-to-r from-default to-primary/20"
  >
    <!-- <img
      src="https://i.pinimg.com/1200x/5f/eb/b5/5febb5e8286f466ff819dd432147f39a.jpg"
      class="absolute inset-0 z-0 object-cover object-center w-full opacity-99"
    /> -->

    <div class="absolute inset-0 z-1 bg-default/50 backdrop-blur-3xl"></div>

    <u-container class="relative z-2">
      <h1
        class="text-3xl sm:tex:4xl lg:text-5xl xl:text-6xl font-semibold text-center text-highlighted"
      >
        {{ job.title }}
      </h1>

      <div class="text-center mt-10 flex flex-col gap-5">
        <div>
          {{ job.location }}
        </div>

        <div class="">
          <div class="flex flex-wrap justify-center items-center gap-2">
            <u-badge color="neutral" variant="solid" size="xl">
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

            <u-badge color="neutral" variant="solid" size="xl">
              <u-icon name="i-lucide-notebook-text" sizz="8" />
              {{ $t(`job.items.contractType.types.${job.contractType}`) }}
            </u-badge>

            <template v-if="job.salary">
              <u-badge color="neutral" variant="solid" size="xl">
                <u-icon name="i-lucide-banknote" sizz="8" />
                <ui-salary-selector v-model="job.salary" display />
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
              variant="solid"
              size="xl"
            >
              {{ skill }}
            </u-badge>
          </div>
        </div>

        <div>
          <u-button
            size="xl"
            color="primary"
            class="px-4 py-3 cursor-pointer"
            @click="apply?.scrollIntoView({ behavior: 'smooth' })"
          >
            {{ $t("apply.actions.apply") }}
          </u-button>
        </div>
      </div>
    </u-container>
  </div>

  <u-container class="py-15 max-w-6xl">
    <ui-job-page :job />
  </u-container>

  <div ref="apply" class="w-full bg-surface py-">
    <u-container class="py-15 max-w-6xl">
      <ui-apply-create :job />
    </u-container>
  </div>
</template>
