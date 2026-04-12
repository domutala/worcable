<script lang="ts" setup>
import { CurrencyAvailaible } from "~~/server/shared";

const state = defineModel<{ desiredGrossSalary?: number }>({ required: true });
</script>

<template>
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
</template>
