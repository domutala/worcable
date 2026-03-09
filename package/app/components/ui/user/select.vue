<script setup lang="ts">
import type { IModalOptions } from "~/interfaces";
import type { User } from "~~/server/database/collections";
import type { IDataResult } from "~~/server/interfaces";

const emit = defineEmits<(e: "select", user: User) => void>();

const { modal } = defineProps<{ modal?: IModalOptions }>();
const { open, uid } = useModal(modal);

const result = ref<IDataResult<User>>();
const users = ref<User[]>([]);
const fetching = ref(false);

watch(open, () => {
  users.value = [];
  if (open.value) getUsers();
});
async function getUsers() {
  fetching.value = true;

  try {
    const query = {};

    result.value = await Api.$fetch<any>("/api/admin/user", { query });
    const r = _.cloneDeep(result.value!.items);

    users.value.push(...r);
    users.value = _.uniqBy(users.value, "id");
  } finally {
    fetching.value = false;
  }
}

function select(user: User) {
  emit("select", user);
}
</script>

<template>
  <ui-modal-2 v-bind="modal" v-bind:uid="uid" :ui="{ content: 'max-w-3xl' }">
    <template #content>
      <ui-layout-inset>
        <div class="space-y-1.5 p-5">
          <u-button
            v-for="user in users"
            :key="user.id"
            class="bg-default border border-default rounded h-17 justify-start px-4"
            block
            @click="select(user)"
          >
            <template v-if="user">
              <UAvatar
                :src="Utils.getFileUrl(user.avatar)"
                :alt="[user.firstName, user.lastName].join(' ')"
                class="rounded-2xl text-md"
                size="2xl"
              />

              {{ user.firstName }}
              {{ user.lastName }}
            </template>

            <span v-else class="opacity-30 text-sm">
              {{ $t(`user.items.email.placeholder`) }}
            </span>
          </u-button>
        </div>
      </ui-layout-inset>
    </template>
  </ui-modal-2>
</template>
