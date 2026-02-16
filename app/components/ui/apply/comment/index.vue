<script lang="ts" setup>
import type { Apply, ApplyComment, Job } from "~~/server/database/schema";
import _ from "lodash";

const job = defineModel<Job>("job", { required: true });
const apply = defineModel<Apply>("apply", { required: true });
const comments = ref<ApplyComment[]>([]);

function pushComment(comment: ApplyComment) {
  const i = comments.value.findIndex((c) => c.id === comment.id);
  if (i === -1) comments.value.unshift(comment);
  else comments.value[i] = comment;
}
</script>

<template>
  <div>
    <ui-apply-comment-create
      v-model:job="job"
      v-model:apply="apply"
      @submit="pushComment"
    />

    <div class="mt-3"></div>

    <ui-apply-comment-list
      v-model:job="job"
      v-model:apply="apply"
      v-model:comments="comments"
    />
  </div>
</template>
