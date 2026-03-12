import { getJob } from "../services/job_get";
import { getApplyDataSchema } from "../shared";

export default defineEventHandler(async (event) => {
  const $t = await useTranslation(event);
  const body = await readBody(event);

  const jobID = body.id as string;
  const job = await getJob({ id: jobID, $t });

  const dataParsed = await parseZod(
    getApplyDataSchema({ $t, applyDataConfigs: job.applyDataConfigs }),
    body,
  );

  const apply = await collections.$Apply.create({
    data: dataParsed.data,
    jobID: job._id,
  });

  return { id: apply.id };
});
