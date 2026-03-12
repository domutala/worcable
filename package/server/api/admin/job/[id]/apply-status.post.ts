import { getJob } from "~~/server/services/job_get";
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
  const status = await parseZod(schema, body);

  await collections.$Job.updateOne({ _id: id }, { applyStatus: status });

  return await getJob({ id, $t });
});
