export default defineEventHandler(async (event) => {
  const $t = await useTranslation(event);
  const id = getRouterParam(event, "id") as string;

  const jobUser = await collections.$JobUser.findOne({
    userID: event.context.session.user.id,
    jobID: id,
  });

  if (!jobUser) {
    throw createError({
      statusCode: 404,
      data: { message: $t("job.errors.user_job_not_found") },
    });
  }

  return jobUser;
});
