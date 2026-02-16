import * as z from "zod";
import { getApplyCommentSchema } from "~~/server/services/apply_comment_schema";

export default defineEventHandler(async (event) => {
  const $t = await useTranslation(event);
  const body = await readBody(event);
  const applyID = getRouterParam(event, "id") as string;

  if (!applyID || !z.uuid().safeParse(applyID).success) {
    throw createError({
      statusCode: 400,
      data: { message: $t("apply.errors.invalid_id") },
    });
  }

  const [apply] = await db
    .select()
    .from(tables.apply)
    .where(eq(tables.apply.id, applyID));

  if (!apply) {
    throw createError({
      statusCode: 404,
      data: { message: $t("apply.errors.apply_not_found") },
    });
  }

  const { schema } = getApplyCommentSchema($t);
  const dataParsed = schema.safeParse(body);

  if (dataParsed.error) {
    throw createError({
      statusCode: 400,
      data: {
        messages: dataParsed.error.issues.map((issue) => ({
          message: issue.message,
          path: issue.path[0],
        })),
      },
    });
  }

  const [comment] = await db
    .insert(tables.applyComment)
    .values({
      ...dataParsed.data,
      applyID,
    })
    .returning();

  return comment;
});
