import mongoose from "mongoose";
import {
  availability,
  educationLevel,
} from "~~/server/services/apply_get_shema";
import { FileSchema } from "./file";
import { InferSchemaType } from "~~/server/database/types";

const DataSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    cv: { type: FileSchema, required: true },

    avatar: { type: FileSchema },
    phone: { type: String },
    desiredGrossSalary: { type: Number },
    motivation: { type: String },

    educationLevel: { type: String, enum: educationLevel },
    availability: { type: String, enum: availability },
  },
  { _id: false },
);

const AllStatusSchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    date: { type: String, required: true },
  },
  { _id: false },
);

const ApplySchema = new mongoose.Schema(
  {
    normalizedFullname: { type: String, required: true },

    jobID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },

    status: { type: String },
    allStatus: { type: [AllStatusSchema], required: true, default: [] },

    note: { type: Number },

    data: { type: DataSchema, required: true },
  },
  {
    timestamps: true,
  },
);

export type ApplyDocument = mongoose.HydratedDocumentFromSchema<
  typeof ApplySchema
>;

export type Apply = InferSchemaType<typeof ApplySchema>;

ApplySchema.index(
  { normalizedFullname: "text" },
  { weights: { normalizedFullname: 5 } },
);

ApplySchema.pre("validate", function () {
  if (this.data) {
    this.normalizedFullname = normalize(
      [this.data.firstName, this.data.lastName].filter((e) => e).join(" "),
    );
  }
});

ApplySchema.pre("updateOne", function () {
  const update = this.getUpdate() as mongoose.UpdateQuery<ApplyDocument>;

  if (update?.data) {
    update.normalizedFullname = normalize(
      [update.data.firstName, update.data.lastName].filter((e) => e).join(" "),
    );
  }
});

ApplySchema.set("toJSON", {
  transform: (_doc, ret) => {
    (ret as any).id = ret._id.toString();
  },
});

export const $Apply = mongoose.model("Apply", ApplySchema);
