import pkg from "./package.json";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  vue: { propsDestructure: true },

  runtimeConfig: {
    databaseUrl: "",
    uploadsKey: "",
    secretKey: "",

    public: {
      appUrl: "",
      areaCompletionUrl: "",
      version: pkg.version,
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
    defaultLocale: "en",
  },

  i18n: {
    defaultLocale: "en",
    strategy: "prefix",
    experimental: { localeDetector: "localeDetector.ts" },

    locales: [
      { code: "en", name: "English", file: "en.json", dir: "ltr" },
      { code: "fr", name: "Français", file: "fr.json", dir: "ltr" },
    ],
  },
});
