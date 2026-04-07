import { createJob } from "~~/server/services/job/create";
import { checkJobUserRole } from "~~/server/services/job/get";

export default defineEventHandler(async (event) => {
  const $t = await useTranslation(event);
  const body = await readBody(event);
  const id = getRouterParam(event, "id") as string;

  await checkJobUserRole({
    $t,
    user: event.context.session.user,
    service: event.context.session.service,
    jobID: id,
    roles: ["admin", "service"],
  });

  return await createJob({ $t, userID: event.context.session.user.id, body });
});
