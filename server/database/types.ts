import mongoose from "mongoose";

export type InferSchemaType<T> = mongoose.InferSchemaType<T> & {
  id: string;
  _id: string;
};
