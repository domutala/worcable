import { ACCEPTED_AVATAR_TYPES, MAX_FILE_SIZE } from "../../file";
import { ApplyDataOptions } from "../types";

const options: ApplyDataOptions = {
  schema({ $t }) {
    const schema = z
      .any()
      .refine(
        (file) => ACCEPTED_AVATAR_TYPES.includes(file?.type),
        $t("apply.items.cv.errors.type"),
      )
      .refine(
        (file) => file?.size <= MAX_FILE_SIZE,
        $t("apply.items.avatar.errors.size"),
      );

    return schema;
  },
};

export default options;
