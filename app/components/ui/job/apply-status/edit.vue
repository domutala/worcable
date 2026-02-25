<script setup lang="ts">
import { getJobShema } from "~~/server/services/job_schema";
import * as z from "zod";
import _ from "lodash";
import type { FormSubmitEvent } from "@nuxt/ui";
import type { Job } from "~~/server/database/schema";
import { updateApplyStatus } from "~/tools/apply";

const { singleApplyStatus: schema } = getJobShema(Use.i18n.t);
type Schema = z.output<typeof schema>;

const job = defineModel<Job>("job", { required: true });
const applyStatus = defineModel<z.output<typeof schema>>("applyStatus");
const colors = [
  "red",
  "orange",
  "yellow",
  "lime",
  "green",
  "teal",
  "cyan",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
];

let state = reactive<Partial<Schema>>(
  _.cloneDeep(
    applyStatus.value || { key: Math.random().toString().substring(2, 8) },
  ),
);

const open = defineModel<boolean>("open");
const submiting = ref(false);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  submiting.value = true;

  const all = _.cloneDeep(job.value.applyStatus);
  const i = all.findIndex((a) => a.key === applyStatus.value?.key);

  if (i === -1) all.push(event.data);
  else all[i] = event.data;

  try {
    job.value = await updateApplyStatus(job.value, all);
    open.value = false;

    state = _.cloneDeep(
      applyStatus.value || { key: Math.random().toString().substring(2, 8) },
    );
  } catch (error) {
  } finally {
    submiting.value = false;
  }
}
</script>

<template>
  <ui-modal v-model:open="open" :ui="{ content: 'max-w-3xl' }">
    <slot />

    <template #content>
      <ui-apply-status-display
        v-slot="{ color, label, icon, bgColor, borderColor }"
        v-model:job="job"
        :status="applyStatus?.key"
      >
        <ui-layout-inset>
          <template #header>
            <div class="flex items-center gap-2 px-5 py-4 relative border-b-0">
              <u-icon :name="icon" class="size-6" />

              <div v-if="applyStatus">
                {{ label }}
              </div>
              <div v-else>
                {{ $t("job.items.applyStatus.labels.new_title") }}
              </div>
            </div>
          </template>

          <u-container class="py-10 max-w-2xl">
            <u-form
              :schema="schema"
              :state="state"
              class="space-y-4"
              @submit="onSubmit"
            >
              <u-form-field
                name="label"
                :label="$t('job.items.applyStatus.labels.label')"
                class="w-full"
              >
                <u-input
                  v-model="state.label"
                  class="w-full"
                  :ui="{ base: 'p-4' }"
                ></u-input>
              </u-form-field>

              <div class="flex items-center gap-2">
                <u-form-field
                  name="color"
                  :label="$t('job.items.applyStatus.labels.color')"
                  class="w-full"
                >
                  <u-select
                    v-model="state.color"
                    :items="colors"
                    :ui="{ base: 'p-4' }"
                    class="w-full"
                  >
                    <template #default="{ modelValue }">
                      <template v-if="modelValue">
                        <div
                          class="w-7 h-3 rounded-2xl border border-default mr-3 my-auto"
                          :style="{ backgroundColor: modelValue }"
                        ></div>

                        {{ modelValue }}
                      </template>
                    </template>

                    <template #item-leading="{ item }">
                      <div
                        class="w-7 h-3 rounded-2xl border border-default mr-3 my-auto"
                        :style="{ backgroundColor: item }"
                      ></div>
                    </template>
                  </u-select>
                </u-form-field>

                <u-form-field name="icon" label="icone" class="w-20">
                  <ui-icon-selecter v-model="state.icon">
                    <div
                      class="h-16 rounded-min flex items-center justify-center ring ring-default w-full cursor-pointer bg-default"
                      :icon="state.icon"
                      square
                    >
                      <u-icon
                        v-if="state.icon"
                        :name="state.icon"
                        class="size-6"
                      />

                      <u-icon
                        v-else
                        name="i-lucide-feather"
                        class="size-6 opacity-30"
                      />
                    </div>
                  </ui-icon-selecter>
                </u-form-field>
              </div>

              <div class="flex items-center justify-">
                <u-button
                  :loading="submiting"
                  class="cursor-pointer px-5 py-3 rounded-min"
                  color="primary"
                  variant="solid"
                  size="xl"
                  type="submit"
                >
                  {{ $t("words.to_save") }}
                </u-button>
              </div>
            </u-form>
          </u-container>
        </ui-layout-inset>
      </ui-apply-status-display>
    </template>
  </ui-modal>
</template>
