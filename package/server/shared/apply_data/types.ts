import * as z from "zod";

export type ApplyDataOptions = {
  required?: boolean;
  formRequired?: "use" | "require";
  schema(options: { $t(str: string): string }): z.ZodType;
};

export type ApplyDataConfig = Record<string, "use" | "require">;
