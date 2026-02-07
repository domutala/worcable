// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    databaseUrl: "",
    uploadsKey: "",

    supabaseProjetcId: "",
    supabaseApiKey: "",
    supabasePublishableKey: "",
    supabaseEnpoint: "",

    public: {
      appUrl: "",
      areaCompletionUrl: "",
    },
  },

  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
    "@nuxtjs/i18n",
    "@nuxt/content",
    "nuxt-swiper",
    "dayjs-nuxt",
    "@pinia/nuxt",
  ],

  devtools: {
    enabled: true,
  },

  css: ["~/assets/css/main.css", "~/assets/css/main.scss"],

  components: [{ path: "~/components/ui", global: true, prefix: "ui" }],

  colorMode: {
    classSuffix: "",
    storageKey: "nuxt-color-mode",
  },

  ui: {
    theme: {
      colors: [
        "primary",
        "secondary",
        "info",
        "success",
        "warning",
        "error",

        "light",
      ],
    },
  },

  icon: {
    customCollections: [
      {
        prefix: "custom",
        dir: "./app/assets/icons",
      },
    ],
  },

  compatibilityDate: "2025-01-15",

  eslint: {
    config: {
      stylistic: {
        commaDangle: "never",
        braceStyle: "1tbs",
      },
    },
  },

  dayjs: {
    locales: ["en", "fr"],
    plugins: [
      "isToday",
      "isYesterday",
      "isTomorrow",
      "weekOfYear",
      "isoWeek",
      "isBetween",
      "relativeTime",
      "utc",
      "timezone",
      "calendar",
      "localizedFormat",
    ],
    defaultLocale: "fr",
  },

  i18n: {
    defaultLocale: "fr",
    strategy: "prefix_and_default",

    experimental: { localeDetector: "localeDetector.ts" },

    locales: [
      { code: "en", name: "English", file: "en.json", dir: "ltr" },
      { code: "fr", name: "Français", file: "fr.json", dir: "ltr" },
    ],
  },
});
