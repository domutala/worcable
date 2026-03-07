import mongoose from "mongoose";
import { InferSchemaType } from "../types";

const JobUserSchema = new mongoose.Schema(
  {
    jobID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

export type JobUserDocument = mongoose.HydratedDocumentFromSchema<
  typeof JobUserSchema
>;
export type JobUser = InferSchemaType<typeof JobUserSchema>;

JobUserSchema.set("toJSON", {
  transform: (_doc, ret) => {
    (ret as any).id = ret._id.toString();
  },
});

export const $JobUser = mongoose.model("JobUser", JobUserSchema);
