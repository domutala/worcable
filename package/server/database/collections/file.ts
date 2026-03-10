import mongoose, { InferSchemaType } from "mongoose";

// export const FileSchema = new mongoose.Schema(
//   {
//     filename: { type: String, required: true },
//     type: { type: String },
//     data: { type: Buffer, required: true },
//     size: { type: Number, required: true },
//     url: { type: String },
//   },
// );

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
