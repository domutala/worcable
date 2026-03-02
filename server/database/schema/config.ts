import mongoose from "mongoose";
import { FileSchema } from "../../mongoose/collectioons/file";
import { getConfigSchema } from "~~/server/services/config_get_shema";

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

export type Config = mongoose.InferSchemaType<typeof ConfigSchema> & {
  id: string;
};

ConfigSchema.set("toJSON", {
  transform: (_doc, ret) => {
    (ret as any).id = ret._id.toString();
  },
});

export const $Config = mongoose.model("Config", ConfigSchema);
