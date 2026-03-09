<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";
import onFetchError from "~/tools/onFetchError";
import { getUserShema } from "~~/server/services/user_shema";

definePageMeta({ layout: false });

const loading = ref(false);
const fields: AuthFormField[] = [
  {
    name: "firstName",
    type: "text",
    size: "xl",
    placeholder: Use.i18n.t("user.items.firstName.label"),
    required: true,
    ui: { base: "p-5 rounded-2xl ring-0 bg-surface" },
  },

  {
    name: "firstName",
    type: "text",
    size: "xl",
    placeholder: Use.i18n.t("user.items.firstName.label"),
    required: true,
    ui: { base: "p-5 rounded-2xl ring-0 bg-surface" },
  },
];

const { firstName, lastName, passwordEdit } = getUserShema(Use.i18n.t);
const schema = z.object({ firstName, lastName }).extend(passwordEdit.shape);
type Schema = z.output<typeof schema>;
const state = ref<Partial<Schema>>({});

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  loading.value = true;
  try {
    const token = Use.route.params.token;
    const session = await $fetch("/api/accept-user-invitation", {
      method: "post",
      body: { ...payload.data, token },
    });

    await Store.session.afterLogin(session, true);
  } catch (error) {
    onFetchError(error);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <ui-layout>
    <div class="flex flex-col items-center justify-center gap-4 md:p-4 flex-1">
      <UPageCard
        class="w-full max-w-120 rounded-max bg-transparent md:bg-default sm:p-7 md:shadow-md dark:md:shadow-2xl md:ring-1 ring-0 ring-default"
      >
        <div class="text-center flex flex-col gap-5 mb-15">
          <ui-logo class="mx-auto" />

          <div class="mt-15 sm:px-10">
            <h1 class="text-2xl">
              {{ $t("login.title") }}
            </h1>

            <p class="text-muted">
              {{ $t("login.description") }}
            </p>
          </div>
        </div>

        <u-form
          ref="form"
          :schema="schema"
          :state="state"
          @submit="onSubmit"
          class="space-y-4 w-full relative"
        >
          <UFormField name="firstName">
            <u-input
              v-model="state.firstName"
              :placeholder="$t(`user.items.firstName.label`)"
              class="w-full"
              color="neutral"
              size="xl"
            ></u-input>
          </UFormField>

          <UFormField name="lastName">
            <u-input
              v-model="state.lastName"
              :placeholder="$t(`user.items.lastName.label`)"
              class="w-full"
              color="neutral"
              size="xl"
            ></u-input>
          </UFormField>

          <ui-password v-model="state" />

          <u-button type="submit">
            {{ $t("user.invite.submit") }}
          </u-button>
        </u-form>

        <!-- <UAuthForm
          :schema="schema"
          :fields="fields"
          :submit="{
            label: $t('login.submit'),
            block: false,
            size: 'xl',
            class: 'cursor-pointer',
          }"
          :loading
          icon="i-lucide-user"
          @submit="onSubmit"
        >
          <template #password-hint>
            <ULink to="#" class="text-primary font-medium" tabindex="-1">
              Forgot password?
            </ULink>
          </template>

          <template #submit="{ loading }">
            <div class="flex justify-end px-1.5">
              <u-button
                type="submit"
                size="lg"
                variant="solid"
                color="primary"
                class="cursor-pointer p-3"
              >
                {{ $t("login.submit") }}
              </u-button>
            </div>
          </template>

          <template #header>
            <div class="text-center flex flex-col gap-5 mb-15">
              <ui-logo class="mx-auto" />

              <div class="mt-15 sm:px-10">
                <h1 class="text-2xl">
                  {{ $t("login.title") }}
                </h1>

                <p class="text-muted">
                  {{ $t("login.description") }}
                </p>
              </div>
            </div>
          </template>
        </UAuthForm> -->
      </UPageCard>
    </div>
  </ui-layout>
</template>
