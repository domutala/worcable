import { getJobShema } from "~~/server/services/job_schema";
import { isValidObjectId } from "mongoose";
import { getJob } from "~~/server/services/job_get";

export default defineEventHandler(async (event) => {
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
    const _id = body.id;

    if (!_id || !isValidObjectId(_id)) {
      throw createError({
        statusCode: 400,
        data: { message: $t("job.errors.invalid_id") },
      });
    }

    const exists = await collections.$Job.exists({ _id });
    if (!exists) {
      throw createError({
        statusCode: 404,
        data: { message: $t("job.errors.job_not_found") },
      });
    }
    await collections.$Job.updateOne({ _id }, jobData).exec();

    return await getJob({ id: _id, $t });
  } else {
    const job = await collections.$Job.create(jobData);
    return job;
  }
});
