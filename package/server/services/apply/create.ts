import { getApplyDataSchema } from "~~/server/shared";
import { getJob } from "../job_get";

export async function createApply({
  $t,
  body,
}: {
  $t: (str: string) => string;
  body: any;
}) {
  const jobID = body.jobID as string;
  const job = await getJob({ id: jobID, $t });

  const dataParsed = await parseZod(
    getApplyDataSchema({ $t, applyDataConfigs: job.applyDataConfigs }),
    body,
  );

  const apply = await collections.$Apply.create({
    data: dataParsed,
    jobID: job._id,
  });

  return apply;
}
