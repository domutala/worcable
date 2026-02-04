<script lang="ts" setup>
import onFetchError from "~/tools/onFetchError";

const {
  data: job,
  status,
  refresh,
} = await useFetch(`/api/admin/job/${Use.route.params.id}`, {
  method: "get",
  onResponseError: (error) => onFetchError(error),
});
</script>

<template>
  <nuxt-page v-if="job" :job />
</template>
