<script setup lang="ts">
import { CurrencyAvailaible } from "~~/server/interfaces";

const { timeInterval, forceCurrency, display } = defineProps<{
  timeInterval?: "month" | "year";
  forceCurrency?: CurrencyAvailaible;
  display?: boolean;
}>();
const value = defineModel<number>({ default: 45 });
const currency = ref(forceCurrency ?? CurrencyAvailaible.EUR);

const min = computed(() => {
  if (timeInterval === "month") {
    return currency.value === "XOF" ? 230_000 : 350;
  }

  return currency.value === "XOF" ? 3_900_000 : 6_000;
});
const interval = computed(() => {
  if (timeInterval === "month") {
    return currency.value === "XOF" ? 5_000 : 100;
  }

  return currency.value === "XOF" ? 50_000 : 500;
});
</script>

<template>
  <div v-if="!display" class="flex gap-1">
    <div
      class="rounded-2xl bg-default border border-default h-16 w-full flex items-center px-5 gap-3"
    >
      <USlider v-model="value" color="neutral" :min="0" :max="200" multiple />
      <span v-if="value !== undefined">
        {{
          Utils.formatCurrency(value * interval + min, currency, {
            locale: $i18n.locale,
            style: forceCurrency ? "currency" : "decimal",
          })
        }}
      </span>
    </div>

    <u-select
      v-if="!forceCurrency"
      v-model="currency"
      class="w-40"
      color="neutral"
      size="xl"
      value-key="value"
      :items="
        Object.keys(CurrencyAvailaible).map((key) => ({
          value: key,
          label: $t(`currency.items.${key}.label`),
        }))
      "
      :ui="{ base: 'rounded-2xl p-5 px-7' }"
      :placeholder="$t(`currency.label`)"
    ></u-select>
  </div>
</template>
