<script lang="ts" setup>
import type { FormSubmitEvent } from "@nuxt/ui";
import MarkdownIt from "markdown-it";
import * as z from "zod";
import { watchImmediate } from "@vueuse/core";
import { getApplyDataShema } from "~~/server/services/apply_get_shema";
import type { Job } from "~~/server/database/schema";
import onFetchError from "~/tools/onFetchError";
import { CurrencyAvailaible } from "~~/server/interfaces";

const { job } = defineProps<{ job: Job }>();

const md = new MarkdownIt();
const i18n = useI18n();

const availability = ["immediately", "1month", "2mois", "3mois", "other"];
const educationLevel = [
  "none",
  "bepCap",
  "baccalaureate",
  "bacPlus2",
  "bacPlus3",
  "bacPlus4",
  "bacPlus5",
  "doctorate",
];

const successContainer = useTemplateRef("successContainer");
const submitting = ref(false);
const success = ref(false);
const schema = getApplyDataShema(i18n.t);
type Schema = z.output<typeof schema>;
const state = reactive<Partial<Schema>>({});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  submitting.value = true;
  try {
    const data = event.data;
    const formData = new FormData();

    for (const key of Object.keys(data)) {
      const value = data[key as "cv"];

      if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    }

    formData.append("id", job.id);
    await $fetch("/api/apply", { method: "post", body: formData });

    success.value = true;
    successContainer.value?.scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    onFetchError(error);
  } finally {
    submitting.value = false;
  }
}

function createObjectUrl(file?: File) {
  if (!file) return;
  return URL.createObjectURL(file);
}

function onChange(key: "cv" | "avatar", file?: File | null | undefined) {
  state[key] = file ?? undefined;
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-7" @submit="onSubmit">
    <UFormField name="avatar">
      <UFileUpload
        v-slot="{ open, removeFile }"
        accept="image/png, image/jpeg, image/webp"
        @update:model-value="(f) => onChange('avatar', f)"
      >
        <div class="flex items-center gap-8">
          <UAvatar
            class="size-32 border border-default"
            size="xl"
            :src="createObjectUrl(state.avatar)"
            :alt="[state.firstName, state.lastName].filter((e) => e).join(' ')"
          >
            <UIcon
              v-if="!state.avatar && !state.firstName && !state.lastName"
              name="i-lucide-user-round"
              class="opacity-50 size-18"
            />
          </UAvatar>

          <div>
            <div class="flex gap-1.5">
              <UButton
                size="lg"
                variant="outline"
                color="neutral"
                class="cursor-pointer"
                icon="i-lucide-upload"
                @click="open()"
              >
                {{
                  $t(
                    state.avatar
                      ? "apply.items.avatar.create_btn.update"
                      : "apply.items.avatar.create_btn.add",
                  )
                }}
              </UButton>

              <UButton
                v-if="state.avatar"
                size="lg"
                variant="outline"
                color="neutral"
                class="cursor-pointer"
                @click="removeFile()"
              >
                {{ $t("apply.items.avatar.remove") }}
              </UButton>
            </div>

            <div class="mt-0.5 opacity-70">
              {{ $t("apply.items.avatar.info") }}
            </div>
          </div>
        </div>
      </UFileUpload>
    </UFormField>

    <UFormField
      :label="$t('apply.items.firstName.label')"
      name="firstName"
      required
    >
      <UInput
        v-model="state.firstName"
        :ui="{ base: 'p-5 px-5 ring-0 rounded-xl' }"
        :placeholder="$t('apply.items.firstName.placeholder')"
        class="w-full"
        size="xl"
        required
      />
    </UFormField>

    <UFormField
      :label="$t('apply.items.lastName.label')"
      name="lastName"
      required
    >
      <UInput
        v-model="state.lastName"
        :ui="{ base: 'p-5 px-5 ring-0 rounded-xl' }"
        :placeholder="$t('apply.items.lastName.placeholder')"
        class="w-full"
        size="xl"
      />
    </UFormField>

    <UFormField :label="$t('apply.items.email.label')" name="email" required>
      <UInput
        v-model="state.email"
        :ui="{ base: 'p-5 px-5 ring-0 rounded-xl' }"
        :placeholder="$t('apply.items.email.placeholder')"
        class="w-full"
        size="xl"
      />
    </UFormField>

    <UFormField :label="$t('apply.items.phone.label')" name="phone" required>
      <UInput
        v-model="state.phone"
        :ui="{ base: 'p-5 px-5 ring-0 rounded-xl' }"
        :placeholder="$t('apply.items.phone.placeholder')"
        class="w-full"
        size="xl"
        type="tel"
      />
    </UFormField>

    <UFormField :label="$t('apply.items.cv.label')" name="cv" required>
      <UFileUpload
        :label="$t('apply.items.cv.placeholder')"
        :ui="{
          base: 'bg-default rounded-xl border border-primary/35 cursor-pointer',
        }"
        highlight
        color="neutral"
        :description="$t('apply.items.cv.helper')"
        class="w-full min-h-48"
        accept="application/pdf"
        layout="list"
        v-model="state.cv"
      />
    </UFormField>

    <UFormField
      :label="$t('apply.items.availability.label')"
      name="availability"
      required
    >
      <URadioGroup
        v-model="state.availability"
        variant="card"
        :ui="{ item: 'bg-default', fieldset: 'flex-row gap-1' }"
        :items="
          availability.map((c) => ({
            label: $t(`apply.items.availability.items.${c}`),
            value: c,
          }))
        "
      />
    </UFormField>

    <UFormField
      :label="$t('apply.items.educationLevel.label')"
      name="educationLevel"
      required
    >
      <USelect
        v-model="state.educationLevel"
        :ui="{ base: 'p-5 px-5 ring-0 rounded-xl' }"
        :placeholder="$t('apply.items.educationLevel.placeholder')"
        :items="
          educationLevel.map((c) => ({
            label: $t(`apply.items.educationLevel.items.${c}`),
            value: c,
          }))
        "
        class="w-full"
        size="xl"
      />
    </UFormField>

    <UFormField
      :label="$t('pages.apply.items.desiredGrossSalary')"
      name="desiredGrossSalary"
      required
    >
      <ui-salary-selector-select
        v-model="state.desiredGrossSalary"
        :force-currency="CurrencyAvailaible.EUR"
      />
    </UFormField>

    <UFormField :label="$t('apply.items.motivation.label')" name="motivation">
      <ui-editor
        v-model="state.motivation"
        :placeholder="$t('apply.items.motivation.placeholder')"
        class="max-h-100 bg-default border border-default rounded-2xl overflow-auto"
      />
    </UFormField>

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
        v-if="!success"
        type="submit"
        class="cursor-pointer p-3 px-5 mx-auto rounded-3xl"
        size="xl"
        :loading="submitting"
      >
        {{ $t("apply.actions.submit") }}
      </UButton>

      <div v-else class="text-center">
        <u-icon
          name="i-lucide-file-check-corner"
          class="size-15 text-success"
        />
        <p
          v-html="md.render($t('apply.success'))"
          class="max-w-2xl mx-auto mt-5"
        ></p>
      </div>
      <div ref="successContainer"></div>
    </div>
  </UForm>
</template>
