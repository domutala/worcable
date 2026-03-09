<script lang="ts" setup>
const id = defineModel<string>("id", { required: true });
const side = useCookie<string>(`job-side`, { default: () => "kanban" });
</script>

<template>
  <div class="flex-1 mx-auto overflow-hidden flex flex-col w-full">
    <div
      class="mt-5 mb-2 px- hidden lg:block mx-auto"
      :class="{
        'w-450 px-7': side === 'kanban',
        'w-250': side === 'list',
      }"
    >
      <div
        class="bg-surface rounded-min border border-default flex items-center overflow-hidden w-max"
      >
        <u-button
          :class="{ 'bg-default': side === 'kanban' }"
          icon="i-lucide-kanban"
          class="cursor-pointer rounded-none"
          color="neutral"
          variant="ghost"
          size="md"
          square
          @click="side = 'kanban'"
        >
        </u-button>
        <u-button
          :class="{ 'bg-default': side === 'list' }"
          icon="i-lucide-text"
          class="cursor-pointer rounded-none"
          color="neutral"
          variant="ghost"
          size="md"
          square
          @click="side = 'list'"
        >
        </u-button>
      </div>
    </div>

    <ui-apply-kanban v-if="side === 'kanban'" :job-id="id" />
    <ui-apply-list v-else :job-id="id" />
  </div>
</template>
