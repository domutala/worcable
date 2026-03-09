import { isValidObjectId } from "mongoose";

export async function getJob({
  id,
  $t,
  userID,
}: {
  id: string;
  $t: (str: string) => string;
  userID?: string;
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

  if (userID) {
    const jobIDs = await getUserJobIDs({ $t, userID });
    if (!jobIDs.includes(job._id.toString())) {
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

export async function checkJobUserRole({
  $t,
  userID,
  jobID,
  role,
}: {
  $t: (str: string) => string;
  userID: string;
  jobID: string;
  role: string[];
}) {
  const exists = await collections.$JobUser.exists({
    userID,
    jobID,
    role: { $in: role },
  });

  if (!exists) {
    throw createError({
      statusCode: 404,
      data: { message: $t("session.errors.not_authorized") },
    });
  }
}
