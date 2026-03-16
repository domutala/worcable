import { getJobShema } from "~~/server/services/job_schema";
import { isValidObjectId } from "mongoose";
import { getJob } from "~~/server/services/job_get";

export async function createJob({
  $t,
  userID,
  body,
}: {
  $t: (str: string) => string;
  userID: string;
  body: any;
}) {
  if (body.phone) body.phone = body.phone.toString();

  const { schema } = getJobShema($t);
  const jobData = await parseZod(schema, body);

  if (body.id) {
    const _id = body.id;

    if (!_id || !isValidObjectId(_id)) {
      throw createError({
        statusCode: 400,
        data: { message: $t("job.errors.invalid_id") },
      });
    }

    const exists = await getJob({ $t, id: _id, userID });

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
    await collections.$JobUser.create({ userID, jobID: job._id });

    return job;
  }
}
