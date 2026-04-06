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
    to: { name: "docs-slug", params: { slug: ["what-is-worcable"] } },
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
    title: "content.toc.title",
    bottom: {
      title: "content.toc.bottom.title",
      edit: "https://github.com/domutala/worcable/docs/main/content",
      links: [
        {
          icon: "i-lucide-star",
          label: "content.toc.bottom.star_on_github",
          to: "https://github.com/domutala/worcable",
          target: "_blank",
        },
        {
          icon: "i-lucide-play",
          label: "content.toc.bottom.playground",
          to: "https://playground.worcable.app",
          target: "_blank",
        },
      ],
    },
  },
});
