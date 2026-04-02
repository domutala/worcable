import { getJob } from "~~/server/services/job/get";
import { getJobShema } from "~~/server/services/job_schema";

export default defineEventHandler(async (event) => {
  const $t = await useTranslation(event);
  const id = getRouterParam(event, "id") as string;
  const body = await readBody(event);

  await getJob({
    id,
    $t,
    userID: event.context.session.user.id,
  });

  const { applyStatus: schema } = getJobShema($t);
  const applyStatus = await parseZod(schema, body.applyStatus);

  await collections.$Job.updateOne({ _id: id }, { applyStatus });

  return await getJob({ id, $t });
});
