<script lang="ts" setup>
import type { Apply, ApplyComment, Job } from "~~/server/database/collections";
import _ from "lodash";
import type { User } from "~~/server/database/collections";

const job = defineModel<Job>("job", { required: true });
const apply = defineModel<Apply>("apply", { required: true });
const comment = defineModel<ApplyComment>("comment", { required: true });
const user = ref<User>();

onMounted(async () => {
  if (comment.value.author.user) {
    const url = `/api/admin/user/${comment.value.author.user}`;
    user.value = await $fetch<User>(url, { method: "get" });
  }
});

const author = computed(() => {
  let name = "";
  let email: string | undefined | null = undefined;
  let avatar: string | undefined = undefined;

  if (user.value) {
    email = user.value.email;
    avatar = Utils.getFileUrl(user.value.avatar);
    name = [user.value.firstName, user.value.lastName].join(" ");
  } else if (comment.value.author.candidate) {
    email = apply.value.data.email;
    avatar = Utils.getFileUrl(apply.value.data.avatar);
    name = `${apply.value.data.firstName} ${apply.value.data.lastName}`;
  } else {
    avatar = Utils.getFileUrl(comment.value.author.author?.avatar);
    email = comment.value.author.author?.email;
    name =
      comment.value.author.author?.name ??
      Use.i18n.t("apply_comment.labels.unknown_user");
  }

  return { name, email, avatar };
});
</script>

<template>
  <div class="bg-default rounded-default ring ring-default">
    <div class="flex items-center gap-3 px-5 py-3 border-b border-default">
      <UAvatar
        :src="author.avatar"
        :alt="author.name"
        class="bg-surface rounded-default text-md"
        size="xl"
      >
        <u-icon name="i-lucide-user-round" class="opacity-50" />
      </UAvatar>

      <div class="select-none leading-none flex-1 w-0">
        <div class="truncate">
          {{ author.name }}
        </div>

        <div class="truncate text-sm opacity-50 leading-none">
          {{ author.email }}
        </div>
      </div>

      <div class="mx-auto"></div>

      <div class="text-sm opacity-50">
        {{ Utils.getDateStatus(comment.createdAt) }}
      </div>

      <u-icon name="i-lucide-mail-check" />
    </div>

    <ui-editor v-model="comment.comment" :editable="false" class="p-5" />
  </div>
</template>
