<script lang="ts" setup>
const { applyId: applyID } = defineProps<{ applyId: string }>();
const { apply, status, ready } = useApply(applyID);
const { value: applyModalID } = useModal({ uid: "modal-apply-id" });
</script>

<template>
  <div
    v-if="ready && apply"
    :class="[
      'content sortable-item rounded-min overflow-hidden relative bg-surface/25 ring ring-default/50',
      'group-[.chosen]:bg-default group-[.chosen]:border group-[.chosen]:border-default group-[.chosen]:shadow-none group-[.ghost]:opacity-0',
    ]"
  >
    <div
      class="absolute inset-0 handler cursor-grab z-0"
      @click="applyModalID = apply.id"
    ></div>

    <div class="flex items-center gap-2 p-5 relative pointer-events-none">
      <UAvatar
        :src="Utils.getFileUrl(apply.data.avatar)"
        :alt="[apply.data.firstName, apply.data.lastName].join(' ')"
        class="border-accented rounded text-md"
        size="3xl"
      />

      <div class="select-none leading-[1.1]">
        <div class="font-bold">
          {{ apply.data.firstName }}
          {{ apply.data.lastName }}
        </div>

        <div>
          {{ Utils.getDateStatus(apply.createdAt) }}
        </div>
      </div>

      <div class="h-full ml-auto">
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-message-square-text"
          class="pointer-events-auto"
        >
        </UButton>
      </div>
    </div>

    <div class="flex flex-wrap gap-1 px-5 py-3 relative pointer-events-none">
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-file-text"
        target="_blank"
        class="pointer-events-auto"
        size="md"
        :href="Utils.getFileUrl(apply.data.cv)"
      >
      </UButton>

      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-at-sign"
        target="_blank"
        class="pointer-events-auto"
        size="md"
        :href="`mailto:${apply.data.email}`"
      >
      </UButton>

      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-phone"
        class="pointer-events-auto"
        target="_blank"
        size="md"
        :href="`tel:${apply.data.phone}`"
      >
      </UButton>

      <div class="mx-auto"></div>

      <div class="flex items-center">
        <ui-apply-note :apply-id="applyID" class="pointer-events-auto" />
      </div>
    </div>

    <u-progress
      v-if="status.loading"
      size="md"
      color="neutral"
      class="absolute bottom-0 w-full left-0"
      :ui="{ indicator: 'rounded-none bg-default', base: 'rounded-none' }"
    />
  </div>
</template>
