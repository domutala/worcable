import * as z from "zod";
import { ApplyDataConfig } from "./types";

export function getApplyDataSchema({
  $t,
  applyDataConfigs,
}: {
  $t: (str: string) => string;
  applyDataConfigs: ApplyDataConfig;
}) {
  applyDataConfigs ||= {};

  const keys = Object.keys(applyDataConfigs);
  const useApllyData = applyDataOptionsList.filter(
    (a) => a.required || keys.includes(a.key),
  );

  const schemas: Record<string, z.ZodType<any>> = {};

  for (const dataOptions of useApllyData) {
    const key = dataOptions.key;
    const require = dataOptions.formRequired || applyDataConfigs[key] || "use";

    let schema = dataOptions.schema({ $t });
    if (require === "use") schema = schema.optional();

    schemas[key] = schema;
  }

  return z.object(schemas);
}

export function getApplyDataOptionsList({
  $t,
  applyDataConfigs,
}: {
  $t: (str: string) => string;
  applyDataConfigs: ApplyDataConfig;
}) {
  applyDataConfigs ||= {};

  const keys = Object.keys(applyDataConfigs);
  const useApllyData = applyDataOptionsList.filter(
    (a) => a.required || keys.includes(a.key),
  );

  return useApllyData;
}
