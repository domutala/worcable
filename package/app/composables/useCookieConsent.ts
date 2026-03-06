export function useCookieConsent() {
  const isConsentGiven = ref(false);
  const isModalVisible = ref(false);

  const COOKIE_KEY = "cookie_consent";

  function init() {
    if (import.meta.client) {
      const consent = localStorage.getItem(COOKIE_KEY) === "accepted";

      if (!consent) {
        const toast = useToast();
        const { t: $t } = useI18n();

        toast.add({
          description: $t("cookies.text"),
          icon: "i-lucide-cookie",
          ui: { icon: "size-10", actions: "mt-5" },
          close: false,
          color: "neutral",
          progress: false,
          actions: [
            {
              label: $t("cookies.btn"),
              color: "neutral",
              variant: "solid",
              size: "lg",
              onClick: (e) => {
                acceptCookies();
              },
            },
          ],
        });
      }
    }
  }

  // L'utilisateur accepte les cookies
  const acceptCookies = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    isConsentGiven.value = true;
  };

  return {
    isModalVisible,
    isConsentGiven,
    acceptCookies,
    init,
  };
}
