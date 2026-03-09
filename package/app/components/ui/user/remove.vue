<script lang="ts" setup>
import type { User } from "~~/server/database/collections";

const emit = defineEmits<(e: "remove") => void>();
const user = defineModel<User>("user", { required: true });

const loading = ref(false);
const modal = useTemplateRef("modal");
const toast = useToast();

async function submit() {
  loading.value = true;

  try {
    await Api.$fetch<undefined>(`/api/admin/user/${user.value.id}`, {
      method: "delete",
    });

    toast.add({
      color: "success",
      description: Use.i18n.t("user.invite.success"),
    });

    if (modal.value) modal.value.open = false;
    emit("remove");
  } catch (error) {
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <template
    v-if="
      Store.session.user?.role === 'admin' && user.id !== Store.session.user?.id
    "
  >
    <u-button
      v-if="!$slots.default && modal"
      :loading
      icon="i-lucide-trash-2"
      color="error"
      square
      @click="modal.open = true"
    />
    <slot :loading />

    <ui-modal-2 ref="modal" :ui="{ content: 'max-w-2xl' }">
      <template #content>
        <ui-layout-inset>
          <div class="p-10">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
            inventore ad suscipit magni incidunt fuga consectetur sint sunt
            repellendus vitae omnis nemo officiis, unde eveniet cumque
            laudantium, eius sed. Nam?

            <div class="flex justify- mt-5">
              <u-button
                :loading
                type="submit"
                color="error"
                variant="solid"
                icon="i-lucide-trash-2"
                @click="submit"
              >
                {{ $t("user.invite.submit") }}
              </u-button>
            </div>
          </div>
        </ui-layout-inset>
      </template>
    </ui-modal-2>
  </template>
</template>
