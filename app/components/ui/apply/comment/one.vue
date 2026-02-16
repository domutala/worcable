<script lang="ts" setup>
import type { Apply, ApplyComment, Job } from "~~/server/database/schema";
import _ from "lodash";

const job = defineModel<Job>("job", { required: true });
const apply = defineModel<Apply>("apply", { required: true });
const comment = defineModel<ApplyComment>("comment", { required: true });

const name = computed(() => {
  if (comment.value.author.candidate) {
    return `${apply.value.data.firstName} ${apply.value.data.lastName}`;
  }

  return Use.i18n.t("apply_comment.labels.unknown_user");
});

const email = computed(() => {
  if (comment.value.author.candidate) {
    return apply.value.data.email;
  }

  if (comment.value.author.author) {
    return comment.value.author.author.email;
  }

  return;
});

const avatar = computed(() => {
  if (comment.value.author.candidate) {
    return Utils.getFileUrl(apply.value.data.avatar);
  }

  if (comment.value.author.author) {
    return comment.value.author.author.avatar;
  }

  return;
});
</script>

<template>
  <div class="bg-default rounded-2xl">
    <div class="flex items-center gap-3 px-5 py-3 border-b border-default">
      <UAvatar
        :src="avatar"
        :alt="name"
        class="bg-surface rounded-2xl text-md"
        size="xl"
      >
        <u-icon name="i-lucide-user-round" class="opacity-50" />
      </UAvatar>

      <div class="select-none leading-none flex-1 w-0">
        <div class="truncate">
          {{ name }}
        </div>

        <div class="truncate text-sm opacity-50 leading-none">
          {{ email }}
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
