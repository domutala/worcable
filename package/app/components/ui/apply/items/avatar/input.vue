<script lang="ts" setup>
const state = defineModel<{
  avatar?: File;
  firstName?: string;
  lastName?: string;
}>({ required: true });

const url = computed(() => {
  return Doc.createObjectUrl(state.value.avatar);
});

function onChange(file?: File | null | undefined) {
  state.value.avatar = file ?? undefined;
}
</script>

<template>
  <UFileUpload
    v-slot="{ open }"
    accept="image/png, image/jpeg, image/webp"
    @update:model-value="(f) => onChange(f)"
  >
    <div class="flex items-center gap-8">
      <UAvatar
        class="size-32 border border-default"
        size="xl"
        :alt="[state.firstName, state.lastName].filter((e) => e).join(' ')"
        :src="url"
      >
        <UIcon
          v-if="!state.avatar && !state.firstName && !state.lastName"
          name="i-lucide-user-round"
          class="opacity-50 size-18"
        />
      </UAvatar>

      <div>
        <div class="flex gap-1.5">
          <UButton
            size="lg"
            variant="outline"
            color="neutral"
            class="cursor-pointer"
            icon="i-lucide-upload"
            @click="open()"
          >
            {{
              $t(
                state.avatar
                  ? "apply.items.avatar.create_btn.update"
                  : "apply.items.avatar.create_btn.add",
              )
            }}
          </UButton>

          <UButton
            v-if="state.avatar"
            size="lg"
            variant="outline"
            color="neutral"
            class="cursor-pointer"
            @click="state.avatar = undefined"
          >
            {{ $t("apply.items.avatar.remove") }}
          </UButton>
        </div>

        <div class="mt-0.5 opacity-70">
          {{ $t("apply.items.avatar.info") }}
        </div>
      </div>
    </div>
  </UFileUpload>
</template>
