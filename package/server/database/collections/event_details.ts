import mongoose from "mongoose";
import { InferSchemaType } from "~~/server/database/types";

const EventDetailsSchema = new mongoose.Schema(
  {
    event: { type: String, required: true },
    cbURL: { type: String, required: true },
  },
  { timestamps: true },
);

export type EventDetailsDocument = mongoose.HydratedDocumentFromSchema<
  typeof EventDetailsSchema
>;
export type EventDetails = InferSchemaType<typeof EventDetailsSchema>;

EventDetailsSchema.set("toJSON", {
  transform: (_doc, ret) => {
    (ret as any).id = ret._id.toString();
  },
});

export const $EventDetails = mongoose.model("EventDetails", EventDetailsSchema);
