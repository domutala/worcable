<script lang="ts" setup>
import type { FormSubmitEvent } from "@nuxt/ui";
import { getApplyData } from "~~/server/database/schema";
import MarkdownIt from "markdown-it";
import * as z from "zod";
import { watchImmediate } from "@vueuse/core";

const { setColor } = useHeader();
setColor("black");

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

const success = ref(false);
const schema = getApplyData(i18n.t);
type Schema = z.output<typeof schema>;
const state = reactive<Partial<Schema>>({ desiredGrossSalary: 28000 });

async function onSubmit(event: FormSubmitEvent<Schema>) {
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

    await $fetch("/api/apply", { method: "post", body: formData });

    success.value = true;
  } catch (error) {}
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
  <section
    aria-:label="$t('page.contact.items.Hero section"
    class="bg-background absolute top-0 z-0 h-200 w-full flex-none gap-0 overflow-hidden mask-t-from-transparent mask-t-to-black mask-t-to-37%"
  >
    <div class="absolute -inset-x-48 inset-y-0 md:-inset-x-32 xl:-inset-x-8">
      <!-- <div
          style="
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
            pointer-events: auto;
          "
        >
          <div style="width: 100%; height: 100%">
            <canvas
              style="display: block; width: 1078px; height: 600px"
              data-engine="three.js r182"
              width="1078"
              height="600"
            ></canvas>
          </div>
        </div> -->

      <!-- <div
        data-layer="gradient"
        class="from-gray-300 to-primfrom-primary/0 absolute top-0 right-0 left-0 h-50 flex-none bg-linear-to-b"
      ></div> -->

      <div
        data-layer="columns"
        class="absolute inset-0 flex flex-row flex-nowrap content-center items-center justify-start gap-0 opacity-10 h-256 flex-none overflow-visible p-0"
      >
        <div
          v-for="i in 10"
          :key="i"
          class="border-border/10 from-primary/80 to-primary/0 relative h-full w-px flex-1 border-r bg-linear-to-l backdrop-blur-[25px]"
          aria-hidden="true"
        ></div>

        <div
          v-for="i in 10"
          class="border-border/10 from-primary/80 to-primary/0 relative h-full w-px flex-1 border-r backdrop-blur-[25px] bg-linear-to-r"
          aria-hidden="true"
        ></div>
      </div>

      <!-- <div
        data-layer="background"
        class="from-primary/30 to-background absolute inset-0 flex-none bg-linear-to-b"
        aria-hidden="true"
      ></div> -->
    </div>

    <!-- <div class="absolute inset-0 bg-amber-200"></div> -->
  </section>

  <div class="w-full relative z-10 pt-40 pb-30 text-black">
    <u-container class="">
      <div class="mb-15">
        <h1 class="text-6xl font-bold text-center text-">
          {{ $t("pages.apply.title") }}
        </h1>
      </div>

      <div class="bg-white p-10 relative">
        <p v-if="success" v-html="md.render($t('apply.success'))"></p>

        <UForm
          v-else
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
                  :alt="
                    [state.firstName, state.lastName].filter((e) => e).join(' ')
                  "
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
            <UInput v-model="state.lastName" class="w-full" size="xl" />
          </UFormField>

          <UFormField
            :label="$t('apply.items.email.label')"
            name="email"
            required
          >
            <UInput v-model="state.email" class="w-full" size="xl" />
          </UFormField>

          <UFormField
            :label="$t('apply.items.phone.label')"
            name="phone"
            required
          >
            <UInput v-model="state.phone" class="w-full" size="xl" type="tel" />
          </UFormField>

          <UFormField name="cv" required>
            <UFileUpload
              :label="$t('apply.items.cv.label')"
              :ui="{
                base: 'bg-neutral-100 border border-primary-200 cursor-pointer',
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
            :hint="`${state.desiredGrossSalary} Euro`"
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

          <UFormField
            :label="$t('apply.items.motivation.label')"
            name="motivation"
          >
            <UTextarea v-model="state.motivation" class="w-full" size="xl" />
          </UFormField>

          <UFormField name="acceptCondition">
            <UCheckbox
              v-model="state.acceptCondition"
              :label="$t('apply.items.acceptCondition.label')"
            />
          </UFormField>

          <div class="flex items-center justify-center mt-10">
            <UButton
              type="submit"
              class="cursor-pointer p-3 px-5 mx-auto"
              size="xl"
            >
              {{ $t("apply.submit") }}
            </UButton>
          </div>
        </UForm>
      </div>
    </u-container>
  </div>
</template>
