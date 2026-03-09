<script setup lang="ts">
import * as z from "zod";
import { getUserShema } from "~~/server/services/user_shema";

const { passwordEdit: schema } = getUserShema(Use.i18n.t);
type Schema = z.output<typeof schema>;
const state = defineModel<Partial<Schema>>({ default: {} });

function checkStrength(str?: string) {
  str ||= "";
  const requirements = [
    { regex: /.{8,}/, text: "Minimum 8 caractères" },
    { regex: /\d/, text: "Au moins un chiffre" },
    { regex: /[a-z]/, text: "Au moins une lettre minuscule" },
    { regex: /[A-Z]/, text: "Au moins une lettre majuscule" },
  ];

  return requirements.map((req) => ({
    met: req.regex.test(str),
    text: req.text,
  }));
}

const strength = computed(() => checkStrength(state.value.password));
const score = computed(() => strength.value.filter((req) => req.met).length);

const color = computed(() => {
  if (score.value === 0) return "neutral";
  if (score.value <= 1) return "error";
  if (score.value <= 2) return "warning";
  if (score.value === 3) return "warning";
  return "success";
});
</script>

<template>
  <u-form-field name="password" required>
    <UInput
      v-model="state.password"
      type="password"
      :placeholder="$t('password.items.password.placeholder')"
    />

    <div class="space-y-2 mt-2">
      <UProgress :color="color" :model-value="score" :max="4" size="sm" />

      <ul class="space-y-1" aria-label="Password requirements">
        <li
          v-for="(req, index) in strength"
          :key="index"
          class="flex items-center gap-0.5"
          :class="req.met ? 'text-success' : 'text-muted'"
        >
          <UIcon
            :name="req.met ? 'i-lucide-circle-check' : 'i-lucide-circle-x'"
            class="size-4 shrink-0"
          />

          <span class="text-xs font-light">
            {{ req.text }}
            <span class="sr-only">
              {{ req.met ? " - Requirement met" : " - Requirement not met" }}
            </span>
          </span>
        </li>
      </ul>
    </div>
  </u-form-field>

  <u-form-field name="passwordRepeat" required>
    <UInput
      v-model="state.passwordRepeat"
      type="password"
      :placeholder="$t('password.items.repeat.placeholder')"
    />
  </u-form-field>
</template>
