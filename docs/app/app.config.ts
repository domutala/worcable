export default defineAppConfig({
  ui: {
    colors: {
      primary: "lime",
      neutral: "neutral",
    },

    footer: {
      slots: {
        root: "border-t border-default",
        left: "text-sm text-muted",
      },
    },

    button: {},
  },

  seo: {
    siteName: "Nuxt Docs Template",
  },

  repository: "https://github.com/domutala/worcable",

  header: {
    title: "",
    to: { name: "docs-slug", params: { slug: ["getting-started"] } },
    logo: {
      alt: "",
      light: "",
      dark: "",
    },
    search: true,

    links: [
      {
        icon: "i-simple-icons-github",
        to: "https://github.com/domutala/worcable",
        target: "_blank",
        "aria-label": "GitHub",
      },
    ],
  },
  footer: {
    credits: `© ${new Date().getFullYear()} - by [domutala](https://github.com/domutala)`,
    colorMode: true,
    links: [
      {
        icon: "i-simple-icons-linkedin",
        to: "https://www.linkedin.com/in/domutala",
        target: "_blank",
        "aria-label": "Worcable on LinkedIN",
      },

      {
        icon: "i-simple-icons-github",
        to: "https://github.com/domutala/worcable",
        target: "_blank",
        "aria-label": "Worcable on GitHub",
      },
    ],
  },
  toc: {
    title: "Table of Contents",
    bottom: {
      title: "Community",
      edit: "https://github.com/domutala/worcable/docs/main/content",
      links: [
        {
          icon: "i-lucide-star",
          label: "Star on GitHub",
          to: "https://github.com/domutala/worcable",
          target: "_blank",
        },
        {
          icon: "i-lucide-play",
          label: "Playground",
          to: "https://playground.worcable.app",
          target: "_blank",
        },
      ],
    },
  },
});
