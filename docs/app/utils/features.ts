import type { RouteLocationRaw } from "vue-router";

type Features = Record<string, { icon: string; page: RouteLocationRaw }>;

export const Features: Features = {
  pipeline: { icon: "i-lucide-workflow", page: { name: "pipeline" } },
  cv_parser: { icon: "i-lucide-file-text", page: { name: "cv-parser" } },
  candidate_management: {
    icon: "i-lucide-users-round",
    page: { name: "candidate-management" },
  },
  collaboration: {
    icon: "i-lucide-shield-user",
    page: { name: "collaboration" },
  },
  communication: {
    icon: "i-lucide-messages-square",
    page: { name: "communication" },
  },
  job_distribution: {
    icon: "i-lucide-share-2",
    page: { name: "job_distribution" },
  },
  security: { icon: "i-lucide-shield-check", page: { name: "security" } },
  deployment: { icon: "i-lucide-server", page: { name: "deployment" } },
  career_site: { icon: "i-lucide-globe", page: { name: "career-site" } },
  ai_matching: { icon: "i-lucide-sparkles", page: { name: "ai-matching" } },
};
