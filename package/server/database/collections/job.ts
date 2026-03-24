import mongoose from "mongoose";
import { getJobShema } from "~~/server/services/job_schema";
import { InferSchemaType } from "../types";
import * as z from "zod";

const {
  contractType,
  jobNature,
  defaultApplyStatus,
  statusEnum,
  applyStatus,
  schema,
} = getJobShema();

type Job0 = z.output<typeof schema> & {
  normalizedJobDescription: string;
  normalizedTitle: string;
};

const JobSchema = new mongoose.Schema<Job0>(
  {
    title: { type: String, required: true },
    normalizedTitle: { type: String, required: true },

    jobDescription: { type: String, required: true },
    normalizedJobDescription: { type: String, required: true },

    contractType: { type: String, enum: contractType.options, required: true },
    location: { type: String, required: true },
    jobNature: { type: String, enum: jobNature.options, required: true },
    companyDescription: { type: String },
    salary: { type: [Number, Number] },
    skills: { type: [String], default: [] },
    status: {
      type: String,
      required: true,
      enum: statusEnum.options,
      default: "open",
    },

    applyDataConfigs: { type: mongoose.Schema.Types.Mixed, default: {} },

    applyStatus: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: defaultApplyStatus,
    },
  },
  { timestamps: true },
);

export type JobDocument = mongoose.HydratedDocumentFromSchema<typeof JobSchema>;
export type Job = InferSchemaType<typeof JobSchema>;

if (import.meta.server) {
  JobSchema.index(
    { normalizedTitle: "text", normalizedJobDescription: "text" },
    { weights: { normalizedTitle: 5, normalizedJobDescription: 1 } },
  );

  JobSchema.pre("validate", function () {
    if (this.title) {
      this.normalizedTitle = normalize(this.title);
    }

    if (this.jobDescription) {
      this.normalizedJobDescription = normalize(this.jobDescription);
    }
  });

  JobSchema.pre("updateOne", function () {
    const update = this.getUpdate() as mongoose.UpdateQuery<Job>;

    if (update?.title) update.normalizedTitle = normalize(update.title);
    if (update?.jobDescription) {
      update.normalizedJobDescription = normalize(update.jobDescription);
    }
  });

  JobSchema.set("toJSON", {
    transform: (_doc, ret) => {
      (ret as any).id = ret._id.toString();
    },
  });
}

export const $Job = mongoose.model("Job", JobSchema);
