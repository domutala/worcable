import { getConfigSchema } from "~~/server/services/config_get_shema";

export default defineEventHandler(async (event) => {
  const $t = await useTranslation(event);
  const body = await readBody(event);
  const config = await collections.$Config.findOne();

  const parsedBody = await getConfigSchema($t).schema.safeParseAsync(body);
  if (parsedBody.error) {
    throw createError({
      statusCode: 400,
      data: {
        messages: parsedBody.error.issues.map((issue) => ({
          message: issue.message,
          path: issue.path[0],
        })),
      },
    });
  }

  await collections.$Config.updateOne({ _id: config?._id }, parsedBody.data);

  const _config = await collections.$Config.findOne();
  return _config;
});
