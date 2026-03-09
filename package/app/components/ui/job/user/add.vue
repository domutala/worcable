<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import _ from "lodash";
import { getUserShema, USER_ROLES } from "~~/server/services/user_shema";
import type { User } from "~~/server/database/collections";
import UiUserSelect from "~/components/ui/user/select.vue";
import * as z from "zod";
import type { IModalOptions } from "~/interfaces";

const { jobId: jobID, modal } = defineProps<{
  jobId: string;
  modal?: IModalOptions;
}>();

const { open, uid } = useModal(modal);
const { uid: sUid, open: sOpen, value: sValue } = useModal();

const { job } = useJob(jobID);

const user = ref<User>();
const { role } = getUserShema(Use.i18n.t);
const schema = z.object({
  userID: z.string(Use.i18n.t("job_user.create.items.user.errors.invalid")),
  role,
});
type Schema = z.output<typeof schema>;
const state = ref<Partial<Schema>>({});

const toast = useToast();
const submitting = ref(false);

watch(open, () => {
  if (!open.value) {
    state.value = {};
    user.value = undefined;
  }
});
async function onSubmit(event: FormSubmitEvent<Schema>) {
  submitting.value = true;

  try {
    await $fetch(`/api/admin/job/${job.value.id}/user/add`, {
      method: "post",
      body: event.data,
    });

    toast.add({
      color: "success",
      description: Use.i18n.t("job_user.create.success"),
    });

    open.value = false;
    state.value = {};
    user.value = undefined;
  } catch (error) {
    OnFetchError(error);
  } finally {
    submitting.value = false;
  }
}

function onUserSelect(u: User) {
  user.value = u;
  state.value.userID = u.id;
  sOpen.value = false;
}
</script>

<template>
  <ui-modal-2
    v-if="open && job"
    v-bind="modal"
    v-bind:uid="uid"
    :ui="{ content: 'max-w-3xl' }"
  >
    <template #content>
      <ui-layout-inset>
        <div class="flex-1 flex flex-col items-center justify-center py-10">
          <u-form
            :schema="schema"
            :state="state"
            @submit="onSubmit"
            class="space-y-4 w-200 max-w-[90%] relative"
          >
            <UFormField
              name="userID"
              :label="$t('job_user.create.items.user.label')"
            >
              <u-button
                class="bg-default border border-default rounded-min h-17 justify-start px-4"
                block
                @click="sOpen = true"
              >
                <template v-if="user">
                  <UAvatar
                    :src="Utils.getFileUrl(user.avatar)"
                    :alt="[user.firstName, user.lastName].join(' ')"
                    class="rounded-2xl text-md"
                    size="2xl"
                  />

                  {{ user.firstName }}
                  {{ user.lastName }}
                </template>

                <span v-else class="opacity-30 text-sm">
                  {{ $t(`job_user.create.items.user.placeholder`) }}
                </span>
              </u-button>
            </UFormField>

            <UFormField
              name="role"
              :label="$t('job_user.create.items.role.label')"
              :help="$t('job_user.create.items.role.help')"
            >
              <USelect
                v-model="state.role"
                :placeholder="$t('job_user.create.items.role.placeholder')"
                :items="
                  USER_ROLES.map((c) => ({
                    label: $t(`user.items.role.items.${c}`),
                    value: c,
                  }))
                "
              />
            </UFormField>

            <div class="flex justify-end">
              <u-button
                type="submit"
                color="primary"
                variant="solid"
                :loading="submitting"
              >
                {{ $t("job_user.create.submit") }}
              </u-button>
            </div>
          </u-form>
        </div>
      </ui-layout-inset>

      <ui-user-select :modal="{ uid: sUid }" @select="onUserSelect" />
    </template>
  </ui-modal-2>
</template>
