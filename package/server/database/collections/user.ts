import mongoose from "mongoose";
import { FileSchema } from "./file";
import { InferSchemaType } from "~~/server/database/types";
import { USER_ROLES } from "~~/server/services/user_shema";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true, minlength: 1 },
    lastName: { type: String, required: true, minlength: 1 },
    password: { type: String, select: false },
    avatar: { type: FileSchema },

    role: { type: String, enum: USER_ROLES, default: "admin" },

    isValid: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },

    normalizedFullname: { type: String, required: true },
  },
  { timestamps: true },
);

export type UserDocument = mongoose.HydratedDocumentFromSchema<
  typeof UserSchema
>;

export type User = InferSchemaType<typeof UserSchema>;

UserSchema.index(
  { normalizedFullname: "text" },
  { weights: { normalizedFullname: 5 } },
);

UserSchema.pre("validate", function () {
  if (this.email) {
    this.email = this.email.toLocaleLowerCase().trim();
  }

  this.normalizedFullname = normalize(
    [this.firstName, this.lastName].filter((e) => e).join(" "),
  );
});

UserSchema.pre("updateOne", function () {
  const update = this.getUpdate() as mongoose.UpdateQuery<UserDocument>;

  if (update?.data) {
    update.normalizedFullname = normalize(
      [update.firstName, update.lastName].filter((e) => e).join(" "),
    );
  }
});

UserSchema.set("toJSON", {
  transform: (_doc, ret) => {
    (ret as any).id = ret._id.toString();
    delete ret.password;
  },
});

export const $User = mongoose.model("User", UserSchema);
