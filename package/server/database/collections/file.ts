import mongoose, { InferSchemaType } from "mongoose";

export const ACCEPTED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const FileSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    type: { type: String },
    data: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String },
  },
  { _id: false },
);

export type FileDocument = InferSchemaType<typeof FileSchema>;
