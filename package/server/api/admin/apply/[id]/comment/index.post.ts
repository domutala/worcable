import { getApplyCommentSchema } from "~~/server/services/apply_comment_schema";
import { getApply } from "~~/server/services/apply_get";
import { checkJobUserRole } from "~~/server/services/job/get";

export default defineEventHandler(async (event) => {
  const $t = await useTranslation(event);
  const body = await readBody(event);
  const applyID = getRouterParam(event, "id") as string;

  const { jobID } = await getApply({ id: applyID, $t });
  await checkJobUserRole({
    $t,
    user: event.context.session.user,
    service: event.context.session.service,
    jobID: jobID.toString(),
    roles: ["admin", "recruiter", "service"],
  });

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

  emitter.emit("comment:new", comment);

  return comment;
});
