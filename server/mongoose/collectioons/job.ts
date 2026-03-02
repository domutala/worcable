import mongoose from "mongoose";
import { getJobShema } from "~~/server/services/job_schema";

const { contractType, jobNature, defaultApplyStatus, statusEnum } =
  getJobShema();

const ApplyStatusSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    label: { type: String, maxlength: 180 },
    color: { type: String },
    icon: { type: String },
  },
  { _id: false }, // évite un _id pour chaque élément
);

const JobSchema = new mongoose.Schema(
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

    applyStatus: {
      type: [ApplyStatusSchema],
      required: true,
      default: defaultApplyStatus,
    },
  },
  {
    timestamps: true, // ✅ ajoute createdAt et updatedAt
  },
);

export type Job = mongoose.InferSchemaType<typeof JobSchema> & { id: string };

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

export const $Job = mongoose.model("Job", JobSchema);
