class Use {
  get router() {
    const router = useRouter();
    return router;
  }

  get localePath() {
    const { $localePath } = useNuxtApp();
    return $localePath;
  }

  get route() {
    const route = useRoute();
    return route;
  }

  get i18n() {
    const { $i18n } = useNuxtApp();
    return $i18n;
  }
}

export default new Use();
