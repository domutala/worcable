import { checkJobUserRole } from "~~/server/services/job_get";
import { getUserShema } from "~~/server/services/user_shema";

export default defineEventHandler(async (event) => {
  const $t = await useTranslation(event);
  const body = await readBody(event);
  const id = getRouterParam(event, "id") as string;
  const jobUserID = body.id as string;

  await checkJobUserRole({
    $t,
    userID: event.context.session.user.id,
    jobID: id,
    role: ["admin"],
  });

  const { role: schema } = getUserShema($t);
  const role = parseZod(schema, body.role);

  const jobUser = await collections.$JobUser.findOne({ _id: jobUserID });

  if (!jobUser) {
    throw createError({
      statusCode: 404,
      data: { message: $t("job.errors.job_user_not_found") },
    });
  }

  if (jobUser.userID.toString() === event.context.session.user.id) {
    throw createError({
      statusCode: 404,
      data: { message: $t("session.errors.not_authorized") },
    });
  }

  await jobUser.updateOne({ role });
  return await collections.$JobUser.findOne({ _id: jobUserID });
});
