<script lang="ts" setup></script>

<template>
  <slot name="header" />

  <div
    class="flex-1 flex flex-col overflow-hidden m-2 rounded-2xl border border-default"
  >
    <div class="bg-surface flex-1 overflow-auto flex flex-col">
      <slot />
    </div>
  </div>
</template>
