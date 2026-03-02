import mongoose from "mongoose";
import { InferSchemaType } from "~~/server/mongoose/types";

const SessionSchema = new mongoose.Schema(
  {
    close: { type: Boolean, required: true, default: false },

    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

export type SessionDocument = mongoose.HydratedDocumentFromSchema<
  typeof SessionSchema
>;
export type Session = InferSchemaType<typeof SessionSchema>;

SessionSchema.set("toJSON", {
  transform: (_doc, ret) => {
    (ret as any).id = ret._id.toString();
  },
});

export const $Session = mongoose.model("Session", SessionSchema);
