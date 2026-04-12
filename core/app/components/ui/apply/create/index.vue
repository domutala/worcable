<script lang="ts" setup>
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import type { Job } from "~~/server/database/collections";
import { getApplyDataOptionsList, getApplyDataSchema } from "~~/server/shared";

const emit = defineEmits<(e: "success", id: string) => void>();
const { job, isAdmin } = defineProps<{ job: Job; isAdmin?: boolean }>();

const schema = getApplyDataSchema({
  $t: Use.i18n.t,
  applyDataConfigs: job.applyDataConfigs,
}).extend({
  acceptCondition: z
    .boolean($t("apply.items.acceptCondition.errors.required"))
    .refine(
      (e) => e === true,
      $t("apply.items.acceptCondition.errors.required"),
    ),
});

type Schema = z.output<typeof schema>;
const state = ref<Partial<Schema>>({});

const submitting = ref(false);

const _applyDataOptionsList = computed(() => {
  return getApplyDataOptionsList({
    $t: Use.i18n.t,
    applyDataConfigs: job.applyDataConfigs,
  });
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  submitting.value = true;
  try {
    const data = await Doc.uploadBeforeSubmit(event.data);

    let rID;

    if (isAdmin) {
      const result = await Api.$fetch<Job>(
        `/api/admin/job/${job.id}/add-apply`,
        { method: "post", body: data },
      );

      useApply(result.id);

      dispatchEvent(
        new CustomEvent(`apply:status:null`, {
          detail: { apply: result, action: "apply:add" },
        }),
      );

      rID = result.id;
    } else {
      const result = await Api.$fetch<{ id: string }>(
        `/api/job/${job.id}/apply`,
        { method: "post", body: data },
      );

      rID = result.id;
    }

    emit("success", rID);
  } catch (error) {
    console.error(error);
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <UForm
    :schema
    :state
    class="space-y-7"
    @submit="onSubmit"
    @error="(e) => console.log(e)"
  >
    <template
      v-for="applyDataOptions in _applyDataOptionsList"
      :key="applyDataOptions.key"
    >
      <component
        :is="`ui-apply-items-${applyDataOptions.key}-input`"
        v-model="state"
      />
    </template>

    <UFormField name="acceptCondition" class="mt-">
      <UCheckbox
        v-model="state.acceptCondition"
        variant="card"
        :label="$t('apply.items.acceptCondition.label')"
        :ui="{ root: 'bg-default border-none rounded-2xl' }"
        class="cursor-pointer"
        size="xl"
      />
    </UFormField>

    <div class="flex items-center justify-center mt-10">
      <UButton
        type="submit"
        class="cursor-pointer p-3 px-5 mx-auto rounded-3xl"
        size="xl"
        color="primary"
        variant="solid"
        :loading="submitting"
      >
        {{ $t("apply.actions.submit") }}
      </UButton>
    </div>
  </UForm>
</template>
