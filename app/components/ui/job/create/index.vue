<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import type { StepperItem } from "@nuxt/ui";
import type { Job } from "~~/server/database/schema";
import onFetchError from "~/tools/onFetchError";
import _ from "lodash";

const { job } = defineProps<{ job?: Job }>();

const breakpoints = useBreakpoints(breakpointsTailwind);
const slimStepper = breakpoints.smallerOrEqual("2xl");
const onTop = breakpoints.smallerOrEqual("lg");

const i18n = useI18n();
const refs = {
  title: useTemplateRef("title"),
  jobDetails: useTemplateRef("jobDetails"),
  jobDescription: useTemplateRef("jobDescription"),
  candidateDetails: useTemplateRef("candidateDetails"),
  companyDescription: useTemplateRef("companyDescription"),
};

const iStep = ref(0);
const steps = [
  "title",
  "jobDetails",
  "jobDescription",
  // "candidateDetails",
  "companyDescription",
];
const stepIcons = {
  title: "i-lucide-equal",
  jobDetails: "i-lucide-list-checks",
  jobDescription: "i-lucide-text",
  // "candidateDetails": "i-lucide-user-round",
  companyDescription: "i-lucide-building-2",
};
const data = ref<Record<string, any>>(_.cloneDeep(job || {}));

const items = computed(() => {
  const items = steps.map((step) => {
    return {
      slot: step,
      title: i18n.t(`job.create.steps.${step}.label`),
      icon: stepIcons[step as "title"],
    };
  }) satisfies StepperItem[];

  return items;
});

const isEndStep = computed(() => iStep.value === steps.length - 1);

function gotoNext() {
  const $el = refs[steps[iStep.value] as "title"];
  $el.value?.form?.submit();
}
function gotoPrev() {
  if (iStep.value > 0) iStep.value--;
}

function onNext(dt: Record<string, any>) {
  data.value = { ...data.value, ...dt };

  if (isEndStep.value) onSubmit();
  else iStep.value++;
}

const submitting = ref(false);
async function onSubmit() {
  submitting.value = true;

  try {
    const result = await $fetch("/api/admin/job", {
      method: "post",
      body: data.value,
    });

    Use.router.push(
      Use.localePath({ name: "admin-job-id", params: { id: result?.id } }),
    );
  } catch (error) {
    onFetchError(error);
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <ui-layout class="h-screen">
    <div
      class="fixed top-1/2 left-0 -translate-y-1/2 z-10"
      :class="{
        'relative top-[unset] left-[unset] translate-y-[unset] py-5': onTop,
      }"
    >
      <!-- top-18 left-1/2 translate-y-0 -translate-x-1/2 -->
      <u-container class="max-w-100">
        <!-- <UStepper
          :items="items"
          :ui="{
            wrapper: 'mt-0 flex flex-col items-center justify-center',
            item: 'group/step',
            title: [
              `whitespace-nowrap opacity-50 transition-all group-aria-current:opacity-100 group-aria-current:font-normal group-aria-current:text-lg`,
              slimStepper ? 'group-hover:flex hidden' : '',
            ],
          }"
          v-model="iStep"
          color="neutral"
          orientation="vertical"
          size="md"
          disabled
        >
        
        </UStepper> -->

        <UStepper
          v-model="iStep"
          :items="items"
          :ui="{
            trigger:
              'data-[state=completed]:bg-default! data-[state=active]:bg-default! data-[state=completed]:text-highlighted! data-[state=active]:text-highlighted!',
            wrapper: [
              'mt-0 flex flex-col items-center justify-center relative',
              onTop
                ? 'absolute mt-1.5 left-1/2 -translate-x-1/2 group-aria-current:flex hidden'
                : slimStepper
                  ? 'group-hover:flex hidden'
                  : '',
            ],
            item: ['group/step rounded-default', onTop ? 'mx-2' : ''],
            title: [
              `whitespace-nowrap opacity-50 transition-all group-aria-current:opacity-100 group-aria-current:font-normal group-aria-current:text-lg`,
              slimStepper ? 'text-sm!' : '',
            ],
          }"
          :orientation="onTop ? 'horizontal' : 'vertical'"
          color="neutral"
          size="md"
          disabled
        >
        </UStepper>
      </u-container>
    </div>

    <div
      class="min-h- flex-1 flex flex-col bg-"
      :class="{ 'pointer-events-none': submitting }"
    >
      <template v-if="steps[iStep] === 'title'">
        <ui-job-create-step-title
          ref="title"
          :data
          @input="(dt) => (data = { ...data, ...dt })"
          @submit="onNext"
        />
      </template>

      <template v-else-if="steps[iStep] === 'jobDetails'">
        <ui-job-create-step-job-details
          ref="jobDetails"
          :data
          @input="(dt) => (data = { ...data, ...dt })"
          @submit="onNext"
        />
      </template>

      <template v-else-if="steps[iStep] === 'jobDescription'">
        <ui-job-create-step-job-description
          ref="jobDescription"
          :data
          @input="(dt) => (data = { ...data, ...dt })"
          @submit="onNext"
        />
      </template>
      <template v-else-if="steps[iStep] === 'candidateDetails'">
        <ui-job-create-step-candidate-details
          ref="candidateDetails"
          key="candidateDetails"
          :data
          @input="(dt) => (data = { ...data, ...dt })"
          @submit="onNext"
        />
      </template>
      <template v-else-if="steps[iStep] === 'companyDescription'">
        <ui-job-create-step-company-description
          ref="companyDescription"
          key="companyDescription"
          :data
          @input="(dt) => (data = { ...data, ...dt })"
          @submit="onNext"
        />
      </template>

      <div
        class="sticky bottom-0 z-10 bg-default/10 backdrop-blur-2xl mt-auto py-3 shadow-2xl"
      >
        <u-container>
          <div class="flex items-center gap-2">
            <div class="mx-auto"></div>
            <u-button
              v-if="iStep !== 0"
              :disabled="submitting"
              size="xl"
              color="neutral"
              variant="soft"
              class="p-3 px-4 cursor-pointer border border-default"
              icon="i-lucide-arrow-left"
              @click="gotoPrev"
            >
              {{ $t("job.create.prev") }}
            </u-button>
            <u-button :loading="submitting" class="p-3 px-4" @click="gotoNext">
              {{ $t(isEndStep ? "job.create.save" : "job.create.next") }}
            </u-button>
          </div>
        </u-container>
      </div>
    </div>
  </ui-layout>
</template>
