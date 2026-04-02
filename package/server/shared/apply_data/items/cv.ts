import { MAX_FILE_SIZE } from "../../doc";
import { ApplyDataOptions } from "../types";

const options: ApplyDataOptions = {
  required: true,
  formRequired: "require",
  schema({ $t }) {
    const schema = z
      .any()
      .refine(
        (file) => file !== undefined,
        $t("apply.items.cv.errors.required"),
      )
      .refine(
        (file) => file?.type === "application/pdf",
        $t("apply.items.avatar.errors.type"),
      )

      .refine(
        (file) => file?.size <= MAX_FILE_SIZE,
        $t("apply.items.cv.errors.size"),
      );

    return schema;
  },
};

export default options;
