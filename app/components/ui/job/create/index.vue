<script setup lang="ts">
import type { StepperItem } from "@nuxt/ui";
import type { Job } from "~~/server/database/schema";
import onFetchError from "~/tools/onFetchError";
import _ from "lodash";

const { job } = defineProps<{ job?: Job }>();

const i18n = useI18n();
const refs = {
  title: useTemplateRef("title"),
  jobDetails: useTemplateRef("jobDetails"),
  jobDescription: useTemplateRef("jobDescription"),
  candidateDetails: useTemplateRef("candidateDetails"),
  companyDescription: useTemplateRef("companyDescription"),
};

const iStep = ref(2);
const steps = [
  "title",
  "jobDetails",
  "jobDescription",
  "candidateDetails",
  "companyDescription",
];
const data = ref<Record<string, any>>(_.cloneDeep(job || {}));

const items = [
  {
    slot: "title" as const,
    title: i18n.t("job.create.steps.title.label"),
    icon: "i-lucide-equal",
  },
  {
    slot: "jobDetails" as const,
    title: i18n.t("job.create.steps.jobDetails.label"),
    icon: "i-lucide-list-checks",
  },
  {
    slot: "jobDescription" as const,
    title: i18n.t("job.create.steps.jobDescription.label"),
    icon: "i-lucide-text",
  },
  {
    slot: "candidateDetails" as const,
    title: i18n.t("job.create.steps.candidateDetails.label"),
    icon: "i-lucide-user-round",
  },
  {
    slot: "companyDescription" as const,
    title: i18n.t("job.create.steps.companyDescription.label"),
    icon: "i-lucide-building-2",
  },
] satisfies StepperItem[];

function gotoNext() {
  const $el = refs[steps[iStep.value] as "title"];
  $el.value?.form?.submit();
}
function gotoPrev() {
  if (iStep.value > 0) iStep.value--;
}

function onNext(dt: Record<string, any>) {
  data.value = { ...data.value, ...dt };

  if (iStep.value === steps.length - 1) onSubmit();
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
  <div
    class="min-h-screen flex flex-col bg-surface"
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

    <div class="fixed top-1/2 left-0 -translate-y-1/2 z-10">
      <u-container>
        <UStepper
          :items="items"
          :ui="{
            wrapper: 'mt-0 flex flex-col items-center justify-center',
            item: 'group/step',
            title: `whitespace-nowrap opacity-50 transition-all group-aria-current:opacity-100 group-aria-current:font-normal group-aria-current:text-lg`,
          }"
          v-model="iStep"
          color="neutral"
          orientation="vertical"
          size="md"
          disabled
        >
        </UStepper>
      </u-container>
    </div>

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
            class="rounded-2xl p-3 px-4 cursor-pointer border border-default"
            icon="i-lucide-arrow-left"
            @click="gotoPrev"
          >
            {{ $t("job.create.prev") }}
          </u-button>
          <u-button
            :loading="submitting"
            size="xl"
            class="rounded-2xl p-3 px-4 cursor-pointer"
            @click="gotoNext"
          >
            {{ $t("job.create.next") }}
          </u-button>
        </div>
      </u-container>
    </div>
  </div>
</template>
