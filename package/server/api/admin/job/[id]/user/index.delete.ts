import { checkJobUserRole } from "~~/server/services/job_get";

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

  await jobUser.deleteOne();
});
