import * as z from "zod";

export default defineEventHandler(async (event) => {
  const $t = await useTranslation(event);
  const id = getRouterParam(event, "id") as string;

  if (!id || !z.uuid().safeParse(id).success) {
    throw createError({
      statusCode: 400,
      data: { message: $t("job.errors.invalid_id") },
    });
  }

  const [job] = await db.select().from(tables.job).where(eq(tables.job.id, id));

  if (!job) {
    throw createError({
      statusCode: 404,
      data: { message: $t("job.errors.job_not_found") },
    });
  }

  return job;
});
