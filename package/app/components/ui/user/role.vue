<script lang="ts" setup>
import type { DropdownMenuItem, FormSubmitEvent, SelectItem } from "@nuxt/ui";
import type { User } from "~~/server/database/collections";
import { getUserShema, USER_ROLES } from "~~/server/services/user_shema";
import * as z from "zod";

const { userId: userID } = defineProps<{ userId: string }>();

const { role } = getUserShema(Use.i18n.t);
const schema = z.object({ role });
type Schema = z.output<typeof schema>;

const { modal, user, canEdit } = useUser(userID);
const state = ref<Partial<Schema>>({ role: _.clone(user.value?.role) });

const toast = useToast();
const loading = ref(false);

watch(
  user,
  () => {
    state.value.role = _.clone(user.value.role);
  },
  { deep: true },
);

const items = computed(() => {
  const items: SelectItem[] = USER_ROLES.map((c) => ({
    label: Use.i18n.t(`user.items.role.items.${c}`),
    value: c,
  }));

  return items;
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true;

  try {
    user.value = await Api.$fetch<User>(
      `/api/admin/user/${user.value.id}/role`,
      {
        method: "post",
        body: { id: user.value.id, ...event.data },
      },
    );

    toast.add({
      color: "success",
      description: Use.i18n.t("user.labels.role_update_success"),
    });

    modal.role.open.value = false;
  } catch (error) {
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <template v-if="user">
    <template v-if="canEdit">
      <ui-modal-2 :uid="modal.role.uid" :ui="{ content: 'max-w-2xl' }">
        <slot :loading />
        <u-button
          v-if="!$slots.default"
          :ui="{ leadingIcon: 'size-4' }"
          :loading
          size="md"
          icon="i-lucide-pencil"
        >
          {{ $t(`user.items.role.items.${user.role}`) }}
        </u-button>

        <template #content>
          <ui-layout-inset :ui="{ border: 'h-1' }">
            <div class="flex-1 flex flex-col items-center justify-center py-10">
              <u-form
                ref="form"
                :schema="schema"
                :state="state"
                @submit="onSubmit"
                class="space-y-4 w-200 max-w-[90%] relative"
              >
                <UFormField
                  name="role"
                  :label="$t('user.items.role.label')"
                  :help="$t('user.items.role.hint')"
                >
                  <USelect
                    v-model="state.role"
                    :placeholder="$t('user.items.role.placeholder')"
                    :items
                  />
                </UFormField>

                <div class="flex justify-end">
                  <u-button
                    type="submit"
                    color="primary"
                    variant="solid"
                    :loading
                  >
                    {{ $t("words.to_save") }}
                  </u-button>
                </div>
              </u-form>
            </div>
          </ui-layout-inset>
        </template>
      </ui-modal-2>
    </template>

    <template v-else>
      <slot :loading />
      <u-badge v-if="!$slots.default" variant="soft" size="lg">
        {{ $t(`user.items.role.items.${user.role}`) }}
      </u-badge>
    </template>
  </template>

  <!-- <u-dropdown-menu
    v-if="
      Store.session.user?.role === 'admin' && user.id !== Store.session.user?.id
    "
    :items
  >
    <slot :loading />
    <u-button
      v-if="!$slots.default"
      :ui="{ leadingIcon: 'size-4' }"
      :loading
      icon="i-lucide-pencil"
    >
      {{ $t(`user.items.role.items.${user.role}`) }}
    </u-button>
  </u-dropdown-menu>

  <template v-else>
    <slot :loading />
    <u-badge v-if="!$slots.default" variant="soft" size="lg">
      {{ $t(`user.items.role.items.${user.role}`) }}
    </u-badge>
  </template> -->
</template>
