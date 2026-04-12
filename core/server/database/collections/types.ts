import { getJobShema } from "~~/server/services/job_schema";
import * as z from "zod";

const { schema } = getJobShema();

export type Job = z.output<typeof schema> & {
  normalizedJobDescription: string;
  normalizedTitle: string;
};
