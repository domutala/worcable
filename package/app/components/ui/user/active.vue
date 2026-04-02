<script lang="ts" setup>
import type { User } from "~~/server/database/collections";

const emit = defineEmits<(e: "remove") => void>();
const { userId: userID } = defineProps<{ userId: string }>();

const loading = ref(false);
const toast = useToast();
const { modal, user, canEdit } = useUser(userID);

const value = computed(() => {
  if (!user.value) return;
  return !user.value.active;
});

const key = computed(() => {
  return value.value ? "active" : "deactive";
});

async function submit() {
  loading.value = true;

  try {
    const result = await Api.$fetch<User>(`/api/admin/user/${userID}/active`, {
      method: "post",
      body: { active: value.value },
    });

    toast.add({
      color: "success",
      description: Use.i18n.t(`user.active.${key.value}.success`, {
        name: `${user.value.firstName} ${user.value.lastName}`,
      }),
    });

    user.value = result;

    modal.active.open.value = false;
    emit("remove");
  } catch (error) {
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <template v-if="user && canEdit">
    <ui-modal-2 :uid="modal.active.uid" :ui="{ content: 'max-w-2xl' }">
      <u-button
        v-if="!$slots.default && modal"
        :loading
        :icon="
          key === 'active'
            ? 'i-lucide-user-round-check'
            : 'i-lucide-user-round-minus  '
        "
        color="error"
        square
        @click="modal.active.open.value = true"
      />
      <slot :loading />

      <template #content>
        <ui-layout-inset :ui="{ border: 'h-1' }">
          <div class="p-10">
            {{
              $t(`user.active.${key}.confirm`, {
                name: `${user.firstName} ${user.lastName}`,
              })
            }}

            <div class="flex items-center gap-2 mt-5">
              <u-button
                :loading
                type="submit"
                variant="solid"
                :icon="
                  key === 'active'
                    ? 'i-lucide-user-round-check'
                    : 'i-lucide-user-round-minus  '
                "
                @click="submit"
              >
                {{ $t(`user.active.${key}.submit`) }}
              </u-button>

              <u-button
                :loading
                type="submit"
                @click="modal.active.open.value = false"
              >
                {{ $t("words.to_cancel") }}
              </u-button>
            </div>
          </div>
        </ui-layout-inset>
      </template>
    </ui-modal-2>
  </template>
</template>
