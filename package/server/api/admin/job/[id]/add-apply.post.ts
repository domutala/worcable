import { createApply } from "~~/server/services/apply/create";
import { checkJobUserRole } from "~~/server/services/job/get";

export default defineEventHandler(async (event) => {
  const $t = await useTranslation(event);
  const id = getRouterParam(event, "id") as string;
  const body = await readBody(event);

  await checkJobUserRole({
    $t,
    user: event.context.session.user,
    service: event.context.session.service,
    jobID: id,
    roles: ["admin", "recruiter", "service"],
  });

  const apply = await createApply({ $t, body: { ...body, jobID: id } });

  return apply;
});
