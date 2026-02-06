import * as z from "zod";
import { ConfigCurrency } from "./config_types";

export function getConifShema($t: (string: string) => string) {
  const ApplyData = z.object({
    orgName: z.string($t("config.errors.orgName_invalid")),
    currency: z.enum(ConfigCurrency, $t("config.errors.currency_invalid")),
    cities: z
      .record(
        z.uuid($t("config.errors.cities_id_invalid")),
        z.object(
          { name: z.string($t("config.errors.cities_name_invalid")) },
          $t("config.errors.cities_invalid"),
        ),
      )
      .optional(),
  });

  return ApplyData;
}
