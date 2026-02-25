<script lang="ts" setup></script>

<template>
  <div class="absolute inset-0 bg-linear-to-r from-primary to-default"></div>
  <div class="absolute inset-0 backdrop-blur-3xl bg-default/95"></div>

  <slot name="header" />

  <div class="flex-1 flex flex-col overflow-hidden relative lg:m-2">
    <div class="flex-1 overflow-hidden flex flex-col relative lg:rounded">
      <div
        class="absolute inset-0 bg-surface/25 border-default rounded-[inherit]"
      ></div>

      <div class="relative flex-1 flex flex-col overflow-auto scroller">
        <slot />
      </div>
    </div>
  </div>
</template>
