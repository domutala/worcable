import mongoose from "mongoose";
import { getApplyShema } from "~~/server/services/apply_get_shema";
import { InferSchemaType } from "~~/server/database/types";
import * as z from "zod";

const { schema, status } = getApplyShema((v) => v);

type Apply0 = z.output<typeof schema> & {
  normalizedFullname: string;
  jobID: mongoose.Types.ObjectId;
  allStatus: { status: z.output<typeof status>; date: string }[];
};

const ApplySchema = new mongoose.Schema<Apply0>(
  {
    normalizedFullname: { type: String, required: true },

    jobID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },

    note: { type: Number },

    status: { type: String },

    allStatus: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: [],
    },

    data: { type: mongoose.Schema.Types.Mixed, required: true },
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
