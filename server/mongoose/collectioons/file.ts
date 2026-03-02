import mongoose from "mongoose";

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
