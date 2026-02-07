import * as z from "zod";
import { ConfigCurrency } from "./config_types";
import getFileShema from "./file_get_shema";

export function getConfigSchema($t: (string: string) => string) {
  const logo = getFileShema({
    $t,
    types: ["image/jpeg", "image/png", "image/webp"],
    errorMaxSizeMessage: $t("config.items.errors.logo.max"),
    errorTypeMessage: $t("config.items.errors.logo.invalid"),
  })
    .optional()
    .nullable()
    .default(null);

  const orgName = z
    .string($t("config.items.orgName.errors.invalid"))
    .optional()
    .nullable()
    .default(null);

  const currency = z
    .enum(ConfigCurrency, $t("config.items.currency.errors.invalid"))
    .optional();

  const cityId = z
    .any()
    .refine(async (v) => {
      const id = Number(v);
      if (Number.isNaN(id)) return false;

      const runtime = useRuntimeConfig();
      const area = await $fetch(`${runtime.public.areaCompletionUrl}/${id}`);

      if (!area) return false;
      return true;
    }, $t("config.items.cities.errors.id_invalid"))
    .transform((value) => String(value));

  const cities = z
    .array(cityId, $t("config.items.cities.errors.invalid"))
    .optional();

  const schema = z.object({ logo, orgName, currency, cities });

  return { schema, logo, orgName, currency, cities };
}
