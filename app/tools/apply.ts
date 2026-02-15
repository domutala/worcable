import type { Job } from "~~/server/database/schema";
import { getJobShema } from "~~/server/services/job_schema";
import * as z from "zod";

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
  INTERVIEW: "i-lucide-calendar-range",
  HIRED: "i-lucide-check-check",
  null: "i-lucide-square-dashed-mouse-pointer",
};

const { applyStatus } = getJobShema((v) => v);
export async function updateApplyStatus(
  job: Job,
  newApplyStatus: z.output<typeof applyStatus>,
) {
  try {
    const result = await $fetch<Job>("/api/admin/job", {
      method: "post",
      body: { ...job, applyStatus: newApplyStatus },
    });

    return result;
  } catch (error) {
    OnFetchError(error);
    throw error;
  }
}
