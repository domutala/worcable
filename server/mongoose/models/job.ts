import { getJobShema } from "~~/server/services/job_schema";
import mongoose from "mongoose";

export interface JobDocument {
  id: string;
  title: string;
  contractType: string;
  jobDescription: string;
  location: string;
  jobNature: string;
  companyDescription?: string | undefined;
  salary?: [number, number] | undefined;
  skills?: string[] | undefined;

  normalizedTitle: string;
  normalizedJobDescription: string;
}

const JobSchema = new mongoose.Schema<JobDocument>({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  title: String,
  contractType: String,
  jobDescription: String,
  location: String,
  jobNature: String,
  companyDescription: String,
  salary: [Number, Number],
  skills: Array<String>,

  normalizedTitle: String,
  normalizedJobDescription: String,
});

JobSchema.index(
  {
    normalizedTitle: "text",
    normalizedJobDescription: "text",
  },
  {
    weights: {
      normalizedTitle: 5,
      normalizedJobDescription: 1,
    },
  },
);

export const _Job = mongoose.model<JobDocument>("Job", JobSchema);
