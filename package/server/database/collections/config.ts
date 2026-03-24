import mongoose from "mongoose";
import { getConfigSchema } from "~~/server/services/config_get_shema";
import { InferSchemaType } from "~~/server/database/types";
import * as z from "zod";

const { schema } = getConfigSchema((v) => v);

type Config0 = z.output<typeof schema>;

const ConfigSchema = new mongoose.Schema<Config0>(
  {
    name: { type: String, required: true },
    logo: { type: mongoose.Schema.Types.Mixed },
    primaryColor: { type: String },
    colorMode: { type: String },
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
