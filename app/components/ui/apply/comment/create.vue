<script lang="ts" setup>
import type { Apply, ApplyComment, Job } from "~~/server/database/schema";
import _ from "lodash";
import { getApplyCommentSchema } from "~~/server/services/apply_comment_schema";
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

const emit = defineEmits<(e: "submit", comment: ApplyComment) => void>();

const job = defineModel<Job>("job", { required: true });
const apply = defineModel<Apply>("apply", { required: true });

const { schema } = getApplyCommentSchema(Use.i18n.t);
type Schema = z.output<typeof schema>;
let state = ref<Partial<Schema>>({});

const submitting = ref(false);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  submitting.value = true;
  try {
    const comment = await $fetch<ApplyComment>(
      `/api/admin/apply/${apply.value.id}/comment`,
      { method: "post", body: event.data },
    );

    state.value.comment = "";
    emit("submit", comment);
  } catch (error) {
    OnFetchError(error);
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <UForm
    :schema="schema"
    :state="state"
    class="space-y-1 bg-default border-default rounded-default ring ring-default"
    @submit="onSubmit"
  >
    <UFormField name="comment">
      <ui-editor
        v-model="state.comment"
        :placeholder="$t('apply_comment.items.comment.placeholder')"
        :ui="{ editor: 'max-h-80' }"
        class="bg-default"
      />
    </UFormField>

    <div class="flex items-center px-3 py-2">
      <u-switch
        :label="$t('apply_comment.labels.send_to_candidate_by_mail')"
        :ui="{ label: 'text-sm' }"
      />
      <UButton
        type="submit"
        class="cursor-pointer ml-auto rounded-min"
        size="sm"
        :loading="submitting"
      >
        {{ $t("apply_comment.labels.submit") }}
      </UButton>
    </div>
  </UForm>
</template>
