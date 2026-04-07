<script lang="ts" setup>
import { getConfigSchema } from "~~/server/services/config_get_shema";
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import _ from "lodash";

const { schema, colorEnum } = getConfigSchema(Use.i18n.t);
type Schema = z.output<typeof schema>;
const state = reactive<Partial<Schema>>(_.cloneDeep(Store.config.config));

const submiting = ref(false);
const colors = [
  { value: null, label: Use.i18n.t("colors.default") },
  { value: "red", label: Use.i18n.t("colors.red") },
  { value: "orange", label: Use.i18n.t("colors.orange") },
  { value: "amber", label: Use.i18n.t("colors.amber") },
  { value: "yellow", label: Use.i18n.t("colors.yellow") },
  { value: "lime", label: Use.i18n.t("colors.lime") },
  { value: "green", label: Use.i18n.t("colors.green") },
  { value: "emerald", label: Use.i18n.t("colors.emerald") },
  { value: "teal", label: Use.i18n.t("colors.teal") },
  { value: "cyan", label: Use.i18n.t("colors.cyan") },
  { value: "sky", label: Use.i18n.t("colors.sky") },
  { value: "blue", label: Use.i18n.t("colors.blue") },
  { value: "indigo", label: Use.i18n.t("colors.indigo") },
  { value: "violet", label: Use.i18n.t("colors.violet") },
  { value: "purple", label: Use.i18n.t("colors.purple") },
  { value: "fuchsia", label: Use.i18n.t("colors.fuchsia") },
  { value: "pink", label: Use.i18n.t("colors.pink") },
  { value: "rose", label: Use.i18n.t("colors.rose") },
];

// as typeof colorEnum.options;

async function onSubmit(event: FormSubmitEvent<Schema>) {
  submiting.value = true;

  try {
    let data = event.data;
    data = await Doc.uploadBeforeSubmit(data);

    await Store.config.update(data);
  } catch (error) {
    console.error(error);
  } finally {
    submiting.value = false;
  }
}
</script>

<template>
  <UiBreadcrumb
    :breads="[
      '$home',
      '$admin',
      { label: Use.i18n.t('config.labels.page_title') },
    ]"
  />

  <u-container class="py-20">
    <div class="bg-default rounded-2xl p-7 py-10 mx-auto max-w-3xl">
      <u-form
        ref="form"
        :schema="schema"
        :state="state"
        class="space-y-4 relative"
        @submit="onSubmit"
      >
        <UFormField name="logo">
          <div class="relative w-max">
            <ui-upload
              v-slot="{ open, reset, objectUrls }"
              v-model="state.logo"
              ref="logoUpload"
              class="relative w-max"
              nullable
              :accept="['image/png', ' image/jpeg', 'image/webp']"
            >
              <UAvatar
                class="size-32 border border-default rounded-3xl cursor-pointer"
                size="xl"
                :src="objectUrls[0]"
                :alt="Store.config.config.name"
                @click="open()"
              >
                <UIcon
                  v-if="!state.logo"
                  name="i-lucide-building-2"
                  class="opacity-50 size-18"
                />
              </UAvatar>
              <div
                v-if="state.logo"
                class="absolute bottom-5 right-0 translate-x-1/2"
              >
                <u-button
                  color="error"
                  icon="i-lucide-trash-2"
                  class="cursor-pointer rounded-4xl"
                  variant="solid"
                  square
                  @click="reset"
                ></u-button>
              </div>
            </ui-upload>
          </div>
        </UFormField>

        <UFormField
          :help="$t(`config.items.orgName.hint`)"
          name="orgName"
          class="w-full"
        >
          <u-input
            class="w-full"
            color="neutral"
            :placeholder="$t(`config.items.orgName.placeholder`)"
            v-model="state.name"
          ></u-input>
        </UFormField>

        <u-form-field
          name="color"
          :label="$t('job.items.applyStatus.labels.color')"
          class="w-full"
        >
          <u-select
            v-model="state.primaryColor"
            :items="colors"
            class="w-full"
            clearable
          >
            <!-- --color-cyan-500 -->
            <template #default="{ modelValue }">
              <div
                class="w-7 h-3 rounded-2xl border border-default mr-3 my-auto"
                :style="{
                  backgroundColor: `var(--color-${modelValue ?? 'lime'}-500)`,
                }"
              ></div>

              {{ $t(`colors.${modelValue}`) }}
            </template>

            <template #item-leading="{ item }">
              <div
                class="w-7 h-3 rounded-2xl border border-default mr-3 my-auto"
                :style="{
                  backgroundColor: `var(--color-${item.value ?? 'lime'}-500)`,
                }"
              ></div>
            </template>

            <!-- <template #trailing>
              <u-button
                v-if="state.primaryColor"
                icon="i-lucide-x"
                size="xs"
                class="rounded-full"
                square
                @click.stop="state.primaryColor = null"
              ></u-button>
            </template> -->
          </u-select>
        </u-form-field>

        <!-- <UFormField
          :help="$t(`config.items.cities.hint`)"
          name="cities"
          class="w-full"
        >
          <ui-area-completion
            class="w-full"
            :ui="{ base: 'rounded-2xl p-5 px-7 bg-surface' }"
            :placeholder="$t(`config.items.cities.placeholder`)"
            color="neutral"
            size="xl"
            v-model="state.cities"
          >
          </ui-area-completion>
        </UFormField> -->

        <u-button
          type="submit"
          size="xl"
          class="cursor-pointer"
          :loading="submiting"
        >
          {{ $t("config.actions.save") }}
        </u-button>
      </u-form>
    </div>
  </u-container>
</template>
