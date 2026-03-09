<script lang="ts" setup>
const { userId: userID } = defineProps<{ userId: string }>();
const user = useUser(userID);
</script>

<template>
  <slot v-bind="user" />
</template>
