export default defineEventHandler(async (event) => {
  const $t = await useTranslation(event);
  const id = getRouterParam(event, "id") as string;

  const user = await collections.$User.findById(id);

  if (!user) {
    throw createError({
      statusCode: 404,
      data: { message: $t("user.errors.user_not_found") },
    });
  }

  return user;
});
