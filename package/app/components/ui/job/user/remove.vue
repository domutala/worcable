<script lang="ts" setup>
import type { JobUser, User } from "~~/server/database/collections";

const emit = defineEmits<(e: "remove") => void>();

const { user } = defineProps<{ user: User }>();
const jobUser = defineModel<JobUser>("jobUser", { required: true });

const { jobUser: me } = useJob(jobUser.value.jobID.toString());
const loading = ref(false);
const modal = useTemplateRef("modal");
const toast = useToast();

async function submit() {
  loading.value = true;

  try {
    await Api.$fetch<undefined>(`/api/admin/job/${jobUser.value.jobID}/user`, {
      method: "delete",
      body: { id: jobUser.value.id },
    });

    toast.add({
      color: "success",
      description: Use.i18n.t("job_user.remove.success"),
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
  <template v-if="me.role === 'admin' && jobUser.userID !== me.userID">
    <u-button
      v-if="!$slots.default && modal"
      :loading
      icon="i-lucide-user-round-x"
      color="error"
      square
      @click="modal.open = true"
    />
    <slot :loading />

    <ui-modal-2 ref="modal" :ui="{ content: 'max-w-2xl' }">
      <template #content>
        <ui-layout-inset>
          <div class="p-10">
            {{
              $t("job_user.remove.confirm", {
                name: `${user.firstName} ${user.lastName}`,
              })
            }}

            <div class="flex items-center gap-2 mt-5">
              <u-button
                :loading
                type="submit"
                color="error"
                variant="solid"
                icon="i-lucide-user-round-x"
                @click="submit"
              >
                {{ $t("job_user.remove.submit") }}
              </u-button>

              <u-button :loading type="submit" @click="modal!.open = false">
                {{ $t("job_user.remove.cancel") }}
              </u-button>
            </div>
          </div>
        </ui-layout-inset>
      </template>
    </ui-modal-2>
  </template>
</template>
