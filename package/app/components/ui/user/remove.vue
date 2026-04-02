<script lang="ts" setup>
import type { User } from "~~/server/database/collections";

const emit = defineEmits<(e: "remove") => void>();

const { userId: userID } = defineProps<{ userId: string }>();
const { user } = useUser(userID);

const loading = ref(false);
const toast = useToast();
const { modal, canEdit } = useUser(user.value.id);

async function submit() {
  loading.value = true;

  try {
    await Api.$fetch<undefined>(`/api/admin/user/${user.value.id}`, {
      method: "delete",
    });

    toast.add({
      color: "success",
      description: Use.i18n.t("user.remove.success"),
    });

    modal.remove.open.value = false;
    emit("remove");
  } catch (error) {
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <template v-if="user && canEdit">
    <ui-modal-2 :uid="modal.remove.uid" :ui="{ content: 'max-w-2xl' }">
      <u-button
        v-if="!$slots.default && modal"
        :loading
        icon="i-lucide-trash-2"
        color="error"
        square
        @click="modal.remove.open.value = true"
      />
      <slot :loading />

      <template #content>
        <ui-layout-inset :ui="{ border: 'h-1 to-red-500' }">
          <div class="p-10">
            {{
              $t("user.remove.confirm_message", {
                name: `${user.firstName} ${user.lastName}`,
              })
            }}

            <div class="flex items-center gap-2 mt-5">
              <u-button
                :loading
                type="submit"
                color="error"
                variant="solid"
                icon="i-lucide-trash-2"
                @click="submit"
              >
                {{ $t("user.remove.submit") }}
              </u-button>

              <u-button
                :loading
                type="submit"
                @click="modal.remove.open.value = false"
              >
                {{ $t("user.remove.cancel") }}
              </u-button>
            </div>
          </div>
        </ui-layout-inset>
      </template>
    </ui-modal-2>
  </template>
</template>
