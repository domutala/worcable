<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";
import onFetchError from "~/tools/onFetchError";

definePageMeta({ layout: false });

const loading = ref(false);
const fields: AuthFormField[] = [
  {
    name: "email",
    type: "email",
    size: "xl",
    // label: Use.i18n.t("login.items.email.label"),
    placeholder: Use.i18n.t("login.items.email.placeholder"),
    required: true,
    ui: { base: "p-5 rounded-2xl ring-0 bg-surface" },
  },
  {
    name: "password",
    type: "password",
    size: "xl",
    // label: Use.i18n.t("login.items.password.label"),
    placeholder: Use.i18n.t("login.items.password.placeholder"),
    required: true,
    ui: { base: "p-5 rounded-2xl ring-0 bg-surface" },
  },
  {
    name: "remember",
    label: Use.i18n.t("login.items.remember.label"),
    type: "checkbox",
    size: "xl",
    class: "px-3",
    ui: { base: "cursor-pointer", label: "cursor-pointer w-max" },
  },
];

const schema = z.object({
  email: z.email("Invalid email"),
  password: z.string("Password is required").min(1, "Password is required"),
});

type Schema = z.output<typeof schema>;

Store.session;

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  loading.value = true;
  try {
    const result = await Store.session.login(payload.data);
    await Use.router.push(Use.localePath({ name: "admin" }));
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
        <UAuthForm
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
        </UAuthForm>
      </UPageCard>
    </div>
  </ui-layout>
</template>
