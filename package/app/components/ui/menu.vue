<script lang="ts" setup>
defineProps<{ slim?: boolean }>();
</script>

<template>
  <!-- fixed top-0 left-0 z-150  -->
  <!-- :to="$localePath({ name: 'admin' })" -->

  <u-slideover v-if="Store.session.user" side="left">
    <u-button
      variant="ghost"
      class="rounded-none size-15 border-default/50 flex items-center justify-center p-0"
      :class="{ 'size-8': slim }"
    >
      <u-icon name="i-lucide-menu" class="size-6" :class="{ 'size-5': slim }" />
    </u-button>

    <template #content>
      <div
        class="p-2 flex items-center gap-3 text-left text-lg max-w-full border-b border-default"
      >
        <UAvatar
          :src="Doc.getUrl(Store.session.user.avatar)"
          :alt="`${Store.session.user.firstName} ${Store.session.user.lastName}`"
          size="3xl"
          class="rounded-2xl text-sm"
        />

        <div class="font-normal leading-none">
          <div class="leading-none">
            {{ Store.session.user.firstName }}
            {{ Store.session.user.lastName }}
          </div>

          <div class="text-sm text-primary leading-none">
            {{ $t(`user.items.role.items.${Store.session.user.role}`) }}
            <!-- {{ Store.session.user.email }} -->
          </div>
        </div>
      </div>
    </template>
  </u-slideover>
</template>
