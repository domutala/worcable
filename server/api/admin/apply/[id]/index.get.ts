import * as z from "zod";

export default defineEventHandler(async (event) => {
  const $t = await useTranslation(event);
  const id = getRouterParam(event, "id") as string;

  if (!id || !z.uuid().safeParse(id).success) {
    throw createError({
      statusCode: 400,
      data: { message: $t("apply.errors.invalid_id") },
    });
  }

  const [apply] = await db
    .select()
    .from(tables.apply)
    .where(eq(tables.apply.id, id));

  if (!apply) {
    throw createError({
      statusCode: 404,
      data: { message: $t("apply.errors.apply_not_found") },
    });
  }

  return apply;
});
