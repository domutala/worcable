<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as z from "zod";
import _ from "lodash";
import { getUserShema, USER_ROLES } from "~~/server/services/user_shema";

const { email, role } = getUserShema(Use.i18n.t);
const schema = z.object({ email, role });
type Schema = z.output<typeof schema>;
const toast = useToast();

const state = ref<Partial<Schema>>({});
const modal = useTemplateRef("modal");
const submitting = ref(false);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  submitting.value = true;

  try {
    await $fetch("/api/admin/user/invite", {
      method: "post",
      body: event.data,
    });

    toast.add({
      color: "success",
      description: Use.i18n.t("user.invite.success"),
    });

    if (modal.value) modal.value.open = false;
    state.value = {};
  } catch (error) {
    OnFetchError(error);
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <ui-modal-2 ref="modal" alias="invite-user" :ui="{ content: 'max-w-3xl' }">
    <template #content>
      <ui-layout-inset>
        <div class="flex-1 flex flex-col items-center justify-center py-10">
          <u-form
            ref="form"
            :schema="schema"
            :state="state"
            @submit="onSubmit"
            class="space-y-4 w-200 max-w-[90%] relative"
          >
            <UFormField
              name="email"
              :label="$t('user.items.email.label')"
              :help="$t('user.items.email.hint')"
            >
              <u-input
                v-model="state.email"
                :placeholder="$t(`user.items.email.placeholder`)"
                class="w-full"
                color="neutral"
                size="xl"
              ></u-input>
            </UFormField>

            <!-- <UFormField
            name="firstName"
            :label="$t('user.items.firstName.label')"
            :help="$t('user.items.firstName.hint')"
          >
            <u-input
              v-model="state.firstName"
              :placeholder="$t(`user.items.firstName.placeholder`)"
              class="w-full"
              color="neutral"
              size="xl"
            ></u-input>
          </UFormField>

          <UFormField
            name="lastName"
            :label="$t('user.items.lastName.label')"
            :help="$t('user.items.lastName.hint')"
          >
            <u-input
              v-model="state.lastName"
              :placeholder="$t(`user.items.lastName.placeholder`)"
              class="w-full"
              color="neutral"
              size="xl"
            ></u-input>
          </UFormField> -->

            <UFormField
              name="role"
              :label="$t('user.items.role.label')"
              :help="$t('user.items.role.hint')"
            >
              <USelect
                v-model="state.role"
                :placeholder="$t('user.items.role.placeholder')"
                :items="
                  USER_ROLES.map((c) => ({
                    label: $t(`user.items.role.items.${c}`),
                    value: c,
                  }))
                "
              />
            </UFormField>

            <div class="flex justify-end">
              <u-button type="submit" color="primary" variant="solid">
                {{ $t("user.invite.submit") }}
              </u-button>
            </div>
          </u-form>
        </div>
      </ui-layout-inset>
    </template>
  </ui-modal-2>
</template>
