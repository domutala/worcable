import type { Apply, Job } from "~~/server/database/schema";
import { getJobShema } from "~~/server/services/job_schema";
import * as z from "zod";
import type { DropdownMenuItem } from "@nuxt/ui";

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

export const ApplyUtils = {
  getStatusLabel(job: Job, status?: string | null) {
    const applyStatus = job.applyStatus.find((s) => s.key === status);

    if (!applyStatus) return Use.i18n.t("apply.status.NULL_STATUS.label");
    if (applyStatus?.label) return applyStatus.label;

    let label = Use.i18n.t(`apply.status.${status}.label`);
    if (label === `apply.status.${status}.label`) {
      label = Use.i18n.t(`job.items.applyStatus.labels.without_name`);
    }

    return label;
  },

  getStatusIcon(job: Job, status?: string | null) {
    const applyStatus = job.applyStatus.find((s) => s.key === status);

    if (!applyStatus) return applyStatusIcons.null;
    return applyStatus?.icon ?? applyStatusIcons[applyStatus.key];
  },

  async submitStatus(job: Job, apply: Apply, status: string | null) {
    try {
      const result = await $fetch<Apply>(
        `/api/admin/apply/${apply.id}/status`,
        {
          method: "patch",
          body: { id: job.id, to: status },
        },
      );

      setTimeout(() => {
        dispatchEvent(
          new CustomEvent(`${apply.id}:update`, { detail: result }),
        );
      }, 0);
    } catch (error) {
      OnFetchError(error);
      throw error;
    }
  },
};
