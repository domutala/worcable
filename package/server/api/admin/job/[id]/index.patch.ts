import { createJob } from "~~/server/services/job_create";
import { checkJobUserRole } from "~~/server/services/job_get";

export default defineEventHandler(async (event) => {
  const $t = await useTranslation(event);
  const body = await readBody(event);
  const id = getRouterParam(event, "id") as string;

  await checkJobUserRole({
    $t,
    userID: event.context.session.user.id,
    jobID: id,
    role: ["admin"],
  });

  return await createJob({ $t, userID: event.context.session.user.id, body });
});
