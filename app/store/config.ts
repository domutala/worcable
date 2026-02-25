import onFetchError from "~/tools/onFetchError";
import type { Config } from "~~/server/database/schema";

const store = defineStore(
  "config",
  () => {
    const config = ref<Config>(null as any as Config);

    async function init() {
      try {
        config.value = await $fetch<Config>(`/api/config`);
        setter();
      } catch (error) {
        console.log(error);
      }
    }

    async function update(data: Partial<Config>) {
      try {
        const result = await $fetch<Config>(`/api/admin/config`, {
          method: "post",
          body: data,
        });

        config.value = result;
        setter();

        return result;
      } catch (error) {
        onFetchError(error);
      }
    }

    function setter() {
      if (!import.meta.client) return;
      if (!config.value) return;

      const appConfig = useAppConfig();
      const { $i18n, $colorMode } = useNuxtApp();

      if (config.value.colorMode) {
        $colorMode.preference = config.value.colorMode;
      }

      if (config.value.primaryColor) {
        appConfig.ui.colors.primary = config.value.primaryColor;
      }
      //  else appConfig.ui.colors.primary = "orange";

      $i18n.setLocale(
        Object.keys($i18n.locales.value).includes(config.value.language)
          ? config.value.language
          : "fr",
      );
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
