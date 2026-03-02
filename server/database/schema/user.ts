import mongoose from "mongoose";
import { FileSchema } from "../../mongoose/collectioons/file";
import { InferSchemaType } from "~~/server/mongoose/types";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    firstName: { type: String, required: true, minlength: 1 },
    lastName: { type: String, required: true, minlength: 1 },
    password: { type: String, select: false },
    avatar: { type: FileSchema },
  },
  {
    timestamps: true,
  },
);

export type UserDocument = mongoose.HydratedDocumentFromSchema<
  typeof UserSchema
>;
export type User = InferSchemaType<typeof UserSchema>;

UserSchema.pre("validate", function () {
  if (this.email) {
    this.email = this.email.toLocaleLowerCase().trim();
  }
});

UserSchema.set("toJSON", {
  transform: (_doc, ret) => {
    (ret as any).id = ret._id.toString();
    delete ret.password;
  },
});

export const $User = mongoose.model("User", UserSchema);
