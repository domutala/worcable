import { getJobShema } from "~~/server/services/job_schema";
import * as z from "zod";
import { useMongo } from "~~/server/mongoose";
import { _Job } from "~~/server/mongoose/models/job";

function parsePrimitiveValue(value: string): string | number | boolean | null {
  const trimmed = value.trim();

  // null
  if (trimmed === "null") return null;

  // boolean
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;

  // number (int ou float)
  if (!Number.isNaN(Number(trimmed))) return Number(trimmed);

  // string par défaut
  return value;
}

export default defineEventHandler(async (event) => {
  await useMongo();

  function normalize(str: string) {
    return str
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ")
      .replace(/[-_.*+?^${}()|[\]\\]/g, "");
  }

  const body = await readBody(event);
  if (body.phone) body.phone = body.phone.toString();

  const $t = await useTranslation(event);
  const { schema } = getJobShema($t);
  const dataParsed = schema.safeParse(body);

  if (dataParsed.error) {
    throw createError({
      statusCode: 400,
      data: {
        messages: dataParsed.error.issues.map((issue) => ({
          message: issue.message,
          path: issue.path[0],
        })),
      },
    });
  }

  const jobData = { ...dataParsed.data };

  if (body.id) {
    const id = body.id;
    if (!id || !z.uuid().safeParse(id).success) {
      throw createError({
        statusCode: 400,
        data: { message: $t("apply.errors.invalid_id") },
      });
    }

    const [job] = await db
      .select()
      .from(tables.job)
      .where(eq(tables.job.id, id));

    if (!job) {
      throw createError({
        statusCode: 404,
        data: { message: $t("job.errors.job_not_found") },
      });
    }

    const [_job] = await db
      .update(tables.job)
      .set(jobData)
      .where(eq(tables.job.id, id))
      .returning();

    await _Job.updateOne(
      {
        ..._job,
        normalizedTitle: normalize(_job.title),
        normalizedJobDescription: normalize(_job.jobDescription),
      } as any,
      { id: _job.id },
    );

    return _job;
  } else {
    const [job] = await db.insert(tables.job).values(jobData).returning();

    await _Job.create({
      ...job,
      normalizedTitle: normalize(job.title),
      normalizedJobDescription: normalize(job.jobDescription),
    } as any);

    return job;
  }
});
