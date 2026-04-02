import { getUserShema } from "~~/server/services/user_shema";

export default defineEventHandler(async (event) => {
  const $t = await useTranslation(event);
  const body = await readBody(event);
  const id = getRouterParam(event, "id") as string;

  const { active: schema } = getUserShema($t);
  const active = await parseZod(schema, body.active);
  const user = await collections.$User.findOne({ _id: id });

  if (!user) {
    throw createError({
      statusCode: 404,
      data: { message: $t("job.errors.user_not_found") },
    });
  }

  if (user._id.toString() === event.context.session.user.id) {
    throw createError({
      statusCode: 404,
      data: { message: $t("session.errors.not_authorized") },
    });
  }

  await user.updateOne({ active });
  return await collections.$User.findOne({ _id: id });
});
