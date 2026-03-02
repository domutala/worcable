import mongoose from "mongoose";
import { FileSchema } from "./file";
import { getConfigSchema } from "~~/server/services/config_get_shema";
import { InferSchemaType } from "~~/server/database/types";

const { colorEnum, colorModeEnum, language } = getConfigSchema((v) => v);

const ConfigSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    logo: { type: FileSchema },
    primaryColor: { type: String, enum: colorEnum.options },
    colorMode: { type: String, enum: colorModeEnum.options },
  },
  {
    timestamps: true,
  },
);

export type ConfigDocument = mongoose.HydratedDocumentFromSchema<
  typeof ConfigSchema
>;
export type Config = InferSchemaType<typeof ConfigSchema>;

ConfigSchema.set("toJSON", {
  transform: (_doc, ret) => {
    (ret as any).id = ret._id.toString();
  },
});

export const $Config = mongoose.model("Config", ConfigSchema);
