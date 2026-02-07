import * as z from "zod";
import { getApplyShema } from "~~/server/services/apply_get_shema";

export default defineEventHandler(async (event) => {
  const $t = await useTranslation(event);
  const id = getRouterParam(event, "id") as string;
  const body = await readBody(event);

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

  const { note: schema } = getApplyShema($t);
  const parsedBody = z.object({ note: schema }).safeParse(body);

  if (parsedBody.error) {
    throw createError({
      statusCode: 400,
      data: {
        messages: parsedBody.error.issues.map((issue) => ({
          message: issue.message,
          path: issue.path[0],
        })),
      },
    });
  }

  const [_apply] = await db
    .update(tables.apply)
    .set({ note: parsedBody.data.note })
    .where(eq(tables.apply.id, id))
    .returning();

  return _apply;
});
