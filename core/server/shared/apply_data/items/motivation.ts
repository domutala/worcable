import { ApplyDataOptions } from "../types";

const options: ApplyDataOptions = {
  schema({ $t }) {
    const schema = z
      .string($t("apply.items.motivation.errors.invalid"))
      .optional();

    return schema;
  },
};

export default options;
