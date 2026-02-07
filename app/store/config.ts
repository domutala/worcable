import onFetchError from "~/tools/onFetchError";
import type { Config } from "~~/server/database/schema";

const store = defineStore(
  "config",
  () => {
    const config = ref<Config>(null as any as Config);

    async function init() {
      config.value = await $fetch<Config>(`/api/config`);
    }

    async function update(data: Partial<Config>) {
      try {
        const result = await $fetch<Config>(`/api/admin/config`, {
          method: "post",
          body: data,
        });

        config.value = result;

        return result;
      } catch (error) {
        onFetchError(error);
      }
    }

    return {
      config,
      init,
      update,
    };
  },
  {},
);

export default store;
