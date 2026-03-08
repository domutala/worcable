import { getJob } from "~~/server/services/job_get";
import { getJobShema } from "~~/server/services/job_schema";

export default defineEventHandler(async (event) => {
  const $t = await useTranslation(event);
  const id = getRouterParam(event, "id") as string;
  const body = await readBody(event);

  await getJob({
    id,
    $t,
    userID: event.context.session.user.id,
  });

  const { applyStatus: schema } = getJobShema($t);
  const status = schema.safeParse(body.applyStatus);

  if (status.error) {
    throw createError({
      statusCode: 400,
      data: {
        messages: status.error.issues.map((issue) => ({
          message: issue.message,
          path: issue.path[0],
        })),
      },
    });
  }

  await collections.$Job.updateOne({ _id: id }, { applyStatus: status.data });

  return await getJob({ id, $t });
});
