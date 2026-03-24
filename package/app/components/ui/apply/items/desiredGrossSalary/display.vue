<script lang="ts" setup>
defineProps<{ desiredGrossSalary?: number }>();
</script>

<template>
  <template v-if="typeof desiredGrossSalary === 'number'">
    <template v-if="!$slots.default">
      {{
        Utils.formatCurrency(desiredGrossSalary, "EUR", {
          style: "currency",
          locale: $i18n.locale,
        })
      }}
    </template>
    <slot :desired-grossSalary />
  </template>

  <template v-else>
    <template v-if="!$slots.empty">-</template>
    <slot name="empty" />
  </template>
</template>
