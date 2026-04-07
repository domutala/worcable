import { isValidObjectId } from "mongoose";
import { jobPipeline } from "./pipeline";
import { User } from "~~/server/database/collections";
import { ServiceTier } from "~~/server/types/service_tier";

export async function getJob({
  id,
  $t,
  userID,
  serviceID,
}: {
  id: string;
  $t: (str: string) => string;
  userID?: string;
  serviceID?: string;
}) {
  if (!id || !isValidObjectId(id)) {
    throw createError({
      statusCode: 400,
      data: { message: $t("job.errors.invalid_id") },
    });
  }
  const query: Record<string, any> = { ids: [id] };

  if (userID) query.userID = userID;
  if (serviceID) query.serviceID = serviceID;

  const job = (await jobPipeline({ $t, query })).items[0];
  if (!job) {
    throw createError({
      statusCode: 404,
      data: { message: $t("job.errors.job_not_found") },
    });
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

type checkJobRoleParams = (
  | { userID: string }
  | { user: User }
  | { service: ServiceTier }
) & {
  $t: (str: string) => string;
  jobID: string;
  roles: string[];
};

export async function checkJobUserRole(params: checkJobRoleParams) {
  return await checkJobRole(params);
}

export async function checkJobRole(params: checkJobRoleParams) {
  let role: string | undefined = undefined;

  if ("userID" in params) {
    const jobRole = await collections.$JobUser.findOne({
      userID: params.userID,
      jobID: params.jobID,
      role: { $in: params.roles },
    });

    role = jobRole?.role;
  } else if ("user" in params) {
    const jobRole = await collections.$JobUser.findOne({
      userID: params.user.id,
      jobID: params.jobID,
      role: { $in: params.roles },
    });

    role = jobRole?.role;
  } else {
    role = "service";
    params.service;
  }

  if (!role || !params.roles.includes(role)) {
    throw createError({
      statusCode: 404,
      data: { message: params.$t("session.errors.not_authorized") },
    });
  }
}
