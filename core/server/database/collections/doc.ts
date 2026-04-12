import mongoose from "mongoose";
import { InferSchemaType } from "../types";

export const DocSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  type: { type: String, required: true },
  data: { type: Buffer, required: true },
  size: { type: Number, required: true },
  url: { type: String },
});

export type DocDocument = InferSchemaType<typeof DocSchema>;

DocSchema.set("toJSON", {
  transform: (_doc, ret) => {
    (ret as any).id = ret._id.toString();
  },
});

export const $Doc = mongoose.model("Doc", DocSchema);

export type Doc = InferSchemaType<typeof DocSchema>;
