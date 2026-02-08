export default defineEventHandler(async (event) => {
  if (!event.path.startsWith("/api")) return;

  const $t = await useTranslation(event);

  if (!event.path.startsWith("/api/admin/")) return;
  if (!event.context.session) {
    throw createError({
      statusCode: 403,
      statusMessage: $t("session.errors.not_athorized"),
    });
  }
});
