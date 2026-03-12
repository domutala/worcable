import mongoose from "mongoose";
import { InferSchemaType } from "../types";

import { getApplyCommentSchema } from "~~/server/services/apply_comment_schema";
import { ZodOutput } from "~~/server/utils/zod";

const { schema: _schema, author } = getApplyCommentSchema((str: string) => str);
const schema = _schema.extend({ author });

type ApplyCommentO = ZodOutput<typeof schema> & {
  applyID: mongoose.Schema.Types.ObjectId;
};

const ApplyCommentSchema = new mongoose.Schema<ApplyCommentO>(
  {
    comment: { type: String, required: true },
    author: { type: mongoose.Schema.Types.Mixed, default: {} },
    applyID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Apply",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

export type ApplyCommentDocument = mongoose.HydratedDocumentFromSchema<
  typeof ApplyCommentSchema
>;
export type ApplyComment = InferSchemaType<typeof ApplyCommentSchema>;

ApplyCommentSchema.set("toJSON", {
  transform: (_doc, ret) => {
    (ret as any).id = ret._id.toString();
  },
});

export const $ApplyComment = mongoose.model("ApplyComment", ApplyCommentSchema);
