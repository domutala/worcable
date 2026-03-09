import { checkJobUserRole } from "~~/server/services/job_get";

export default defineEventHandler(async (event) => {
  const $t = await useTranslation(event);
  const id = getRouterParam(event, "id") as string;

  const user = await collections.$User.findOne({ _id: id });
  if (!user) {
    throw createError({
      statusCode: 404,
      data: { message: $t("user.errors.user_not_found") },
    });
  }

  if (user._id.toString() === event.context.session.user.id) {
    throw createError({
      statusCode: 404,
      data: { message: $t("session.errors.not_authorized") },
    });
  }

  await user.deleteOne();
});
