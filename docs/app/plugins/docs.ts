import type { Collections, ContentNavigationItem } from "@nuxt/content";
import { watchImmediate } from "@vueuse/core";

export default defineNuxtPlugin({
  enforce: "post",
  async setup() {
    const route = useRoute();
    const { $i18n } = useNuxtApp();
    const navigation = ref<ContentNavigationItem[]>([]);
    const files = ref<any[]>([]);

    watchImmediate($i18n.locale, fetch);
    async function fetch() {
      const collection = ("docs_" + $i18n.locale.value) as keyof Collections;
      const _navigation = await queryCollectionNavigation(collection);
      const _files = await queryCollectionSearchSections(collection);
      navigation.value = _navigation.at(0)?.children?.at(0)?.children ?? [];

      files.value = _files;
    }

    return {
      provide: { docs: { files, navigation } },
    };
  },
});
