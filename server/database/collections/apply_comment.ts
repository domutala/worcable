import mongoose from "mongoose";
import { InferSchemaType } from "../types";
import { FileSchema } from "./file";

const AuthorSchemaAuthor = new mongoose.Schema(
  {
    email: { type: String },
    name: { type: String },
    avatar: { type: FileSchema },
  },
  { _id: false },
);

const AuthorSchema = new mongoose.Schema(
  {
    candidate: { type: Boolean },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    author: { type: AuthorSchemaAuthor },
  },
  { _id: false },
);

const ApplyCommentSchema = new mongoose.Schema(
  {
    comment: { type: String, required: true },
    author: { type: AuthorSchema, default: {} },
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
