<script setup lang="ts">
import type { StepperItem } from "@nuxt/ui";
import type { Job } from "~~/server/database/collections";

const { job } = defineProps<{ job?: Job }>();

const refs = [
  { key: "title", component: useTemplateRef("title") },
  { key: "jobDetails", component: useTemplateRef("jobDetails") },
  { key: "jobDescription", component: useTemplateRef("jobDescription") },
  {
    key: "applyDataConfigs",
    component: useTemplateRef("applyDataConfigs"),
  },
  {
    key: "companyDescription",
    component: useTemplateRef("companyDescription"),
  },
];

const stepIcons = {
  title: "i-lucide-equal",
  jobDetails: "i-lucide-list-checks",
  jobDescription: "i-lucide-text",
  companyDescription: "i-lucide-building-2",
  applyDataConfigs: "i-lucide-settings",
};

const step = ref(0);
const steps = [
  "title",
  "jobDetails",
  "jobDescription",
  "applyDataConfigs",
  "companyDescription",
];
const data = ref<Record<string, any>>(_.cloneDeep(job || {}));

const items = computed(() => {
  const items = steps.map((val, i) => {
    return {
      index: i,
      value: val,
      slot: val,
      title: Use.i18n.t(`job.create.steps.${val}.label`),
      icon: stepIcons[val as "title"],
      current: i === step.value,
    };
  }) satisfies StepperItem[];

  return items;
});

const current = computed(() => {
  return items.value.find((item) => item.current)!;
});

const isEndStep = computed(() => step.value === steps.length - 1);

const slotProps = computed(() => {
  return {
    next,
    prevent,
    isEndStep: isEndStep.value,
    steps: items.value,
    current: current.value,
    step: step.value,
    submitting: submitting.value,
  };
});

function next() {
  const $el = refs[step.value];
  $el?.component.value?.form?.submit();
}
function prevent() {
  if (step.value > 0) step.value--;
}
function onNext(dt: Record<string, any>) {
  data.value = { ...data.value, ...dt };

  if (isEndStep.value) onSubmit();
  else step.value++;
}

const submitting = ref(false);
async function onSubmit() {
  submitting.value = true;

  try {
    const result = await Api.$fetch<Job>(
      job?.id ? `/api/admin/job/${job.id}` : "/api/admin/job",
      {
        method: job?.id ? "patch" : "post",
        body: data.value,
      },
    );

    useJob(result.id, { force: true });

    Use.router.replace(
      Use.localePath({ name: "admin-job-id", params: { id: result.id } }),
    );
  } catch (error) {
    console.log(error);
  } finally {
    submitting.value = false;
  }
}

defineExpose({ next, prevent, isEndStep, steps, current, step, submitting });
</script>

<template>
  <slot v-bind="slotProps" name="before" />

  <div
    class="flex-1 flex flex-col"
    :class="{ 'pointer-events-none': submitting }"
  >
    <slot v-bind="slotProps" name="in-before" />

    <template v-if="steps[step] === 'title'">
      <ui-job-create-step-title
        ref="title"
        :data
        @input="(dt) => (data = { ...data, ...dt })"
        @submit="onNext"
      />
    </template>

    <template v-else-if="steps[step] === 'jobDetails'">
      <ui-job-create-step-job-details
        ref="jobDetails"
        :data
        @input="(dt) => (data = { ...data, ...dt })"
        @submit="onNext"
      />
    </template>

    <template v-else-if="steps[step] === 'jobDescription'">
      <ui-job-create-step-job-description
        ref="jobDescription"
        :data
        @input="(dt) => (data = { ...data, ...dt })"
        @submit="onNext"
      />
    </template>

    <template v-else-if="steps[step] === 'applyDataConfigs'">
      <ui-job-create-step-apply-data-configs
        ref="applyDataConfigs"
        key="applyDataConfigs"
        v-model="data"
        :data
        @submit="onNext"
      />
    </template>

    <template v-else-if="steps[step] === 'companyDescription'">
      <ui-job-create-step-company-description
        ref="companyDescription"
        key="companyDescription"
        :data
        @input="(dt) => (data = { ...data, ...dt })"
        @submit="onNext"
      />
    </template>

    <slot v-bind="slotProps" name="in-after" />
  </div>

  <slot v-bind="slotProps" name="after" />
</template>
