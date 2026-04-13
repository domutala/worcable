export default defineAppConfig({
  ui: {
    colors: {
      primary: "blue",
      neutral: "neutral",
    },

    footer: {
      slots: {
        root: "border-t border-default",
        left: "text-sm text-muted",
      },
    },

    button: {
      compoundVariants: [
        {
          color: "primary",
          variant: "solid",
          class: "text-white",
        },
      ],
    },

    link: {
      base: "hover:text-primary text-primary-400 transition-colors",
    },
  },

  seo: {
    siteName: "Worcable",
  },

  repository: "https://github.com/domutala/worcable",
  contribueUrl: " https://github.com/domutala/worcable/issues/new/choose",

  links: [
    {
      icon: "i-simple-icons-github",
      to: "https://github.com/domutala/worcable",
      target: "_blank",
    },
    {
      icon: "i-simple-icons-linkedin",
      to: "https://www.linkedin.com/in/domutala",
      target: "_blank",
    },
    {
      icon: "i-simple-icons-bluesky",
      // to: "https://bsky.app/profile/worcable",
      target: "_blank",
    },
    {
      icon: "i-simple-icons-discord",
      // to: "https://bsky.app/profile/worcable",
      target: "_blank",
    },
  ],

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

  docHomePage: { name: "docs-slug", params: { slug: ["what-is-worcable"] } },

  footer: {
    to: { name: "index" },

    groups: {
      "01.about": {
        title: "footer.group.about.title",
        links: [
          {
            to: "https://domutala.netlify.app",
            target: "_blank",
            label: "@domutala",
          },

          {
            to: { name: "why-open-source" },
            label: "footer.group.about.why_open_source",
          },

          {
            to: { name: "contact" },
            label: "footer.group.about.contact",
          },
        ],
      },

      "02.resources": {
        title: "footer.group.resources.title",
        links: [
          {
            to: { name: "docs-slug", params: { slug: ["what-is-worcable"] } },
            label: "footer.group.resources.dcos",
          },

          {
            to: { name: "roadmap" },
            label: "footer.group.resources.roadmap",
          },

          {
            to: { name: "pricing" },
            label: "footer.group.resources.pricing",
          },

          {
            label: "footer.group.resources.security",
          },

          {
            to: { name: "support" },
            label: "footer.group.resources.support",
          },
        ],
      },

      "03.services": {
        title: "footer.group.services.title",
        links: [
          {
            to: null,
            label: "footer.group.services.core_app",
          },

          {
            label: "footer.group.services.cvarser",
          },

          {
            label: "footer.group.services.notifications",
          },

          {
            label: "footer.group.services.all",
          },
        ],
      },

      "04.title": {
        title: "footer.group.legal.title",
        links: [
          {
            to: null,
            label: "footer.group.legal.licence",
          },

          {
            label: "footer.group.legal.cug",
          },

          {
            label: "footer.group.legal.privacy",
          },
        ],
      },
    },
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
