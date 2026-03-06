import mongoose from "mongoose";

export type InferSchemaType<T> = mongoose.InferSchemaType<T> & {
  id: string;
  _id: string;
};

export type PaginateOptions = {
  offset: number;
  page: number;
  pageSize: number;
  all: boolean;
  sortBy: string;
  sortOrder: 1 | -1;
};
