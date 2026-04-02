// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/ui",
    "@nuxtjs/i18n",
    "@nuxt/content",
    "nuxt-og-image",
    "nuxt-llms",
    "@nuxtjs/mcp-toolkit",
  ],

  devtools: {
    enabled: true,
  },

  css: ["~/assets/css/main.css"],

  content: {
    build: {
      markdown: {
        toc: {
          searchDepth: 1,
        },
      },
    },
  },

  experimental: {
    asyncContext: true,
  },

  compatibilityDate: "2024-07-11",

  nitro: {
    prerender: {
      routes: ["/"],
      crawlLinks: true,
      autoSubfolderIndex: false,
    },
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: "never",
        braceStyle: "1tbs",
      },
    },
  },

  // icon: {
  //   provider: 'iconify'
  // },

  llms: {
    domain: "https://docs-template.nuxt.dev/",
    title: "Nuxt Docs Template",
    description:
      "A template for building documentation with Nuxt UI and Nuxt Content.",
    full: {
      title: "Nuxt Docs Template - Full Documentation",
      description: "This is the full documentation for the Nuxt Docs Template.",
    },
    sections: [
      {
        title: "Getting Started",
        contentCollection: "docs",
        contentFilters: [
          { field: "path", operator: "LIKE", value: "/getting-started%" },
        ],
      },
      {
        title: "Essentials",
        contentCollection: "docs",
        contentFilters: [
          { field: "path", operator: "LIKE", value: "/essentials%" },
        ],
      },
    ],
  },

  mcp: {
    name: "Docs template",
  },

  i18n: {
    defaultLocale: "en",
    strategy: "prefix_and_default",
    experimental: { localeDetector: "localeDetector.ts" },

    locales: [
      { code: "en", name: "English", file: "en.json", dir: "ltr" },
      { code: "fr", name: "Français", file: "fr.json", dir: "ltr" },
    ],
  },

  vite: {
    optimizeDeps: {
      include: ["@vueuse/core"],
    },
  },
});
