import mongoose from "mongoose";

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

export type Session = mongoose.InferSchemaType<typeof SessionSchema> & {
  id: string;
};

SessionSchema.set("toJSON", {
  transform: (_doc, ret) => {
    (ret as any).id = ret._id.toString();
  },
});

export const $Session = mongoose.model("Session", SessionSchema);
