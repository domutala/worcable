import { QueryFilter } from "mongoose";
import { isValidObjectId } from "mongoose";

export async function getJob({
  id,
  $t,
  query = {},
}: {
  id: string;
  $t: (str: string) => string;
  query?: Record<string, any>;
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

  if (query.ids) {
    const ids: string[] =
      typeof query.ids === "string" ? query.ids.split(",") : query.ids;

    if (!ids.includes(job._id.toString())) {
      throw createError({
        statusCode: 404,
        data: { message: $t("job.errors.job_not_found") },
      });
    }
  }

  return job;
}

export async function getUserJobIDs({
  $t,
  userID,
}: {
  $t: (str: string) => string;
  userID: string;
}) {
  const jobUsers = await collections.$JobUser.distinct("jobID", { userID });
  return jobUsers.map((id) => id.toString());
}
