import type { Config } from "~~/server/database/schema";

const store = defineStore(
  "config",
  () => {
    const config = ref<Config>(null as any as Config);

    async function init() {
      config.value = await $fetch<Config>(`/api/config`);
    }

    return {
      config,
      init,
    };
  },
  {},
);

export default store;
