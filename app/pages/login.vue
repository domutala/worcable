<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";
import onFetchError from "~/tools/onFetchError";

const toast = useToast();
const loading = ref(false);

const fields: AuthFormField[] = [
  {
    name: "email",
    type: "email",
    size: "xl",
    label: Use.i18n.t("login.items.email.label"),
    placeholder: Use.i18n.t("login.items.email.placeholder"),
    required: true,
  },
  {
    name: "password",
    type: "password",
    size: "xl",
    label: Use.i18n.t("login.items.password.label"),
    placeholder: Use.i18n.t("login.items.password.placeholder"),
    required: true,
  },
  {
    name: "remember",
    label: Use.i18n.t("login.items.remember.label"),
    type: "checkbox",
  },
];

const providers = [
  {
    label: "Google",
    icon: "i-simple-icons-google",
    onClick: () => {
      toast.add({ title: "Google", description: "Login with Google" });
    },
  },
  {
    label: "GitHub",
    icon: "i-simple-icons-github",
    onClick: () => {
      toast.add({ title: "GitHub", description: "Login with GitHub" });
    },
  },
];

const schema = z.object({
  email: z.email("Invalid email"),
  password: z
    .string("Password is required")
    .min(8, "Must be at least 8 characters"),
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
  <div class="flex flex-col items-center justify-center gap-4 p-4 min-h-screen">
    <UPageCard class="w-full max-w-lg rounded-3xl bg-surface p-7">
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
        :providers
        icon="i-lucide-user"
        @submit="onSubmit"
      >
        <template #password-hint>
          <ULink to="#" class="text-primary font-medium" tabindex="-1"
            >Forgot password?</ULink
          >
        </template>

        <template #header>
          <div class="text-center flex flex-col gap-5">
            <ui-logo class="mx-auto" />

            <div>
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
</template>
