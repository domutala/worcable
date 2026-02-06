import { getConifShema } from "~~/server/services/config_get_shema";

export default defineEventHandler(async (event) => {
  const $t = await useTranslation(event);
  const body = await readBody(event);

  const [config] = await db.select().from(tables.config);
  if (!config) await db.insert(tables.config).values({}).returning();

  const parsedBody = getConifShema($t).safeParse(body);
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

  const [_config] = await db
    .update(tables.config)
    .set(parsedBody.data)
    .returning();

  return _config;
});
