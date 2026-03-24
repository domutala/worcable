<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import type { Job } from "~~/server/database/collections";

const { job } = defineProps<{ job?: Job }>();

const breakpoints = useBreakpoints(breakpointsTailwind);
const slimStepper = breakpoints.smallerOrEqual("2xl");
const onTop = breakpoints.smallerOrEqual("lg");
const comp = useTemplateRef("comp");
</script>

<template>
  <ui-layout>
    <template #header>
      <div v-if="comp" class="relative h-15 flex items-center pr-5 gap-2">
        <ui-menu />
        <div class="leading-none flex-1 min-w-0 w-0">
          <h1 class="text-lg font-semibold truncate leading-none">
            <span v-if="job"> {{ job.title }} </span>
            <span v-else>{{ $t("job.create.title") }} </span>
          </h1>
        </div>

        <div class="mx-auto"></div>
        <u-button
          v-if="comp.step !== 0"
          :disabled="comp.submitting"
          color="neutral"
          variant="ghost"
          @click="comp.prevent"
        >
          {{ $t("job.create.prev") }}
        </u-button>
        <u-button :loading="comp.submitting" @click="comp.next">
          {{ $t(comp.isEndStep ? "job.create.save" : "job.create.next") }}
        </u-button>
      </div>
    </template>

    <ui-job-create-step ref="comp" :job>
      <template
        #before="{ step, next, prevent, isEndStep, submitting, current, steps }"
      >
        <div
          class="w-11/12 max-w-120 mx-auto flex justify-between items-start gap-1"
        >
          <div
            v-for="_step in steps"
            :key="_step.value"
            :class="{
              'bg-inverted!': _step.index <= step,
              'bg-primary!': _step.current,
            }"
            class="bg-inverted/30 w-full h-0.5 transition-all"
          ></div>
        </div>
      </template>

      <template
        #in-after="{
          step,
          next,
          prevent,
          isEndStep,
          submitting,
          current,
          steps,
        }"
      >
        <div
          class="sticky bottom-0 z-10 backdrop-blur-2xl mt-auto py-0.5 px-2 shadow-2xl bg-default/50"
        >
          <div class="text-sm text-center sm:text-right">
            {{ current.title }}
          </div>
          <u-container class="hidden">
            <div class="flex items-center gap-2">
              <div class="items-center gap-2 hidden sm:flex">
                <u-icon :name="current.icon" class="size-5" />
                {{ current.title }}
              </div>

              <div class="mx-auto"></div>
              <u-button
                v-if="step !== 0"
                :disabled="submitting"
                size="xl"
                color="neutral"
                variant="soft"
                class="p-3 px-4 cursor-pointer border border-default"
                icon="i-lucide-arrow-left"
                @click="prevent"
              >
                {{ $t("job.create.prev") }}
              </u-button>
              <u-button :loading="submitting" class="p-3 px-4" @click="next">
                {{ $t(isEndStep ? "job.create.save" : "job.create.next") }}
              </u-button>
            </div>
          </u-container>
        </div>
      </template>
    </ui-job-create-step>
  </ui-layout>
</template>
