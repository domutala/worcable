import { isValidObjectId } from "mongoose";

export async function getApply({
  id,
  $t,
}: {
  id: string;
  $t: (str: string) => string;
}) {
  if (!id || !isValidObjectId(id)) {
    throw createError({
      statusCode: 400,
      data: { message: $t("apply.errors.invalid_id") },
    });
  }

  const apply = await collections.$Apply.findById(id);

  if (!apply) {
    throw createError({
      statusCode: 404,
      data: { message: $t("apply.errors.apply_not_found") },
    });
  }

  return apply;
}
