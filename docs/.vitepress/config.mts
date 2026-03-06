import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Worcable",
  description: "Open source recruitment platform",

  vite: {
    plugins: [],
  },

  themeConfig: {
    sidebar: [
      { text: "What is Worcable", link: "/docs/what-is-worcable" },
      { text: "Why Worcable", link: "/docs/why-worcable" },

      {
        text: "Getting Started",
        items: [
          { text: "Installation", link: "/docs/getting-started/installation" },
          { text: "Quick Start", link: "/docs/getting-started/quick-start" },
          {
            text: "First Recruitment",
            link: "/docs/getting-started/first-recruitment",
          },
        ],
      },

      {
        text: "Core Concepts",
        items: [
          { text: "Candidates", link: "/docs/concepts/candidates" },
          { text: "Jobs", link: "/docs/concepts/jobs" },
          { text: "Recruitment Pipeline", link: "/docs/concepts/pipeline" },
          { text: "Evaluations", link: "/docs/concepts/evaluations" },
        ],
      },

      {
        text: "Features",
        items: [
          {
            text: "Candidate Management",
            link: "/docs/features/candidate-management",
          },
          {
            text: "Job Management",
            link: "/docs/features/job-management",
          },
          {
            text: "Recruitment Pipeline",
            link: "/docs/features/recruitment-pipeline",
          },
          { text: "Analytics", link: "/docs/features/analytics" },
          {
            text: "Roles & Permissions",
            link: "/docs/features/roles-permissions",
          },
        ],
      },

      {
        text: "API",
        items: [
          { text: "Overview", link: "/docs/api/overview" },
          { text: "Authentication", link: "/docs/api/authentication" },
          { text: "Candidates API", link: "/docs/api/candidates" },
          { text: "Jobs API", link: "/docs/api/jobs" },
        ],
      },

      {
        text: "Deployment",
        items: [
          { text: "Self Hosting", link: "/docs/deployment/self-hosting" },
          { text: "Docker", link: "/docs/deployment/docker" },
        ],
      },

      {
        text: "Contribution",
        items: [
          {
            text: "Contribution Guide",
            link: "/docs/contribute/contribution-guide",
          },
          { text: "Roadmap", link: "/docs/contribute/roadmap" },
        ],
      },
    ],

    socialLinks: [
      {
        icon: "github",
        link: "/docshttps://github.com/domutala/worcable",
      },
    ],
  },
});
