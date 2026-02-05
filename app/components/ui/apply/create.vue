<script lang="ts" setup>
import type { FormSubmitEvent } from "@nuxt/ui";
import MarkdownIt from "markdown-it";
import * as z from "zod";
import { watchImmediate } from "@vueuse/core";
import { getApplyData } from "~~/server/services/apply_get_data_shema";
import type { Job } from "~~/server/database/schema";
import onFetchError from "~/tools/onFetchError";

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

const submitting = ref(false);
const success = ref(false);
const schema = getApplyData(i18n.t);
type Schema = z.output<typeof schema>;
const state = reactive<Partial<Schema>>({ desiredGrossSalary: 28000 });

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
  <UForm
    :schema="schema"
    :state="state"
    class="space-y-4 p-5"
    @submit="onSubmit"
  >
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
        class="w-full"
        size="xl"
      />
    </UFormField>

    <UFormField :label="$t('apply.items.email.label')" name="email" required>
      <UInput
        v-model="state.email"
        :ui="{ base: 'p-5 px-5 ring-0 rounded-xl' }"
        class="w-full"
        size="xl"
      />
    </UFormField>

    <UFormField :label="$t('apply.items.phone.label')" name="phone" required>
      <UInput
        v-model="state.phone"
        :ui="{ base: 'p-5 px-5 ring-0 rounded-xl' }"
        class="w-full"
        size="xl"
        type="tel"
      />
    </UFormField>

    <UFormField name="cv" required>
      <UFileUpload
        :label="$t('apply.items.cv.label')"
        :ui="{
          base: 'bg-default rounded-xl border border-primary/35 cursor-pointer',
        }"
        highlight
        color="neutral"
        description="Fichier PDF (max. 10MB)"
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
      :hint="`${Utils.formatCurrency(state.desiredGrossSalary || 0, job.salary?.currency || 'XOF', { locale: $i18n.locale, style: 'currency' })}`"
      name="desiredGrossSalary"
      required
    >
      <USlider
        :step="500"
        :min="20000"
        :max="120000"
        size="xl"
        tooltip
        v-model="state.desiredGrossSalary"
      />
    </UFormField>

    <UFormField name="motivation" class="mt-10">
      <div class="bg-default border border-default rounded-2xl overflow-hidden">
        <ui-editor
          v-model="state.motivation"
          :placeholder="$t('apply.items.motivation.label')"
          class="max-h-100 overflow-auto"
        />
      </div>
    </UFormField>

    <UFormField name="acceptCondition" class="mt-10 px-5">
      <UCheckbox
        v-model="state.acceptCondition"
        :label="$t('apply.items.acceptCondition.label')"
        class="cursor-pointer"
        size="xl"
      />
    </UFormField>

    <div class="flex items-center justify-center mt-10">
      <UButton
        v-if="!success"
        type="submit"
        class="cursor-pointer p-3 px-5 mx-auto"
        size="xl"
        :loading="submitting"
      >
        {{ $t("apply.submit") }}
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
    </div>
  </UForm>
</template>
