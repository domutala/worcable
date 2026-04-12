import mongoose from "mongoose";
import { InferSchemaType } from "../types";
import { USER_ROLES } from "~~/server/services/user_shema";

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
    role: { type: String, enum: USER_ROLES, default: "admin" },
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
