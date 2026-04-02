import { ApplyDataOptions } from "../types";

const options: ApplyDataOptions = {
  required: true,
  formRequired: "require",
  schema({ $t }) {
    const schema = z.string($t("apply.items.email.errors.invalid"));

    return schema;
  },
};

export default options;
