import { ApplyDataOptions } from "../types";

const options: ApplyDataOptions = {
  required: true,
  formRequired: "require",
  schema({ $t }) {
    const schema = z
      .string($t("apply.items.lastName.errors.required"))
      .min(2, $t("apply.items.lastName.errors.required"));

    return schema;
  },
};

export default options;
