import { isValidObjectId } from "mongoose";

export async function getJob({
  id,
  $t,
}: {
  id: string;
  $t: (str: string) => string;
}) {
  if (!id || !isValidObjectId(id)) {
    throw createError({
      statusCode: 400,
      data: { message: $t("job.errors.invalid_id") },
    });
  }

  const job = await collections.$Job.findById(id);

  if (!job) {
    throw createError({
      statusCode: 404,
      data: { message: $t("job.errors.job_not_found") },
    });
  }

  return job;
}
