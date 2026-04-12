<script lang="ts" setup>
import type { ApplyComment } from "~~/server/database/collections";

const { applyId: applyID } = defineProps<{ applyId: string }>();
const { apply } = useApply(applyID);

const comments = ref<ApplyComment[]>([]);

function pushComment(comment: ApplyComment) {
  const i = comments.value.findIndex((c) => c.id === comment.id);
  if (i === -1) comments.value.unshift(comment);
  else comments.value[i] = comment;
}
</script>

<template>
  <div v-if="apply">
    <ui-apply-comment-create :apply-id="applyID" @submit="pushComment" />

    <div class="mt-3"></div>

    <ui-apply-comment-list :apply-id="applyID" v-model:comments="comments" />
  </div>
</template>
