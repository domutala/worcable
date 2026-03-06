import { getApplyCommentSchema } from "~~/server/services/apply_comment_schema";
import { getApply } from "~~/server/services/apply_get";

export default defineEventHandler(async (event) => {
  const $t = await useTranslation(event);
  const body = await readBody(event);
  const applyID = getRouterParam(event, "id") as string;

  await getApply({ id: applyID, $t });
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

  const comment = collections.$ApplyComment.create({
    ...dataParsed.data,
    applyID,
    author: { user: event.context.session.user.id.toString() },
  });

  return comment;
});
