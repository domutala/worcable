import type { Apply, Job } from "~~/server/database/collections";

export const applyStatusColors: Record<string, string> = {
  REJECTED: "#ff0000",
  INIT: "#0050da",
  TO_CONTACT: "#a41aff",
  INTERVIEW: "#F59E0B",
  HIRED: "#18ca00",
};

export const applyStatusIcons: Record<string, string> = {
  INIT: "i-lucide-newspaper",
  // INIT: "i-lucide-square-chart-gantt",
  REJECTED: "i-lucide-badge-x",
  TO_CONTACT: "i-lucide-phone-outgoing",
  INTERVIEW2: "i-lucide-calendar-range",
  INTERVIEW: "i-lucide-video",
  HIRED: "i-lucide-check-check",
  null: "i-lucide-square-dashed-mouse-pointer",
};
