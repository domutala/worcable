import { createApply } from "~~/server/services/apply/create";
import { checkJobUserRole } from "~~/server/services/job_get";

export default defineEventHandler(async (event) => {
  const $t = await useTranslation(event);
  const id = getRouterParam(event, "id") as string;
  const body = await readBody(event);

  await checkJobUserRole({
    $t,
    userID: event.context.session.user.id,
    jobID: id,
    role: ["admin", "recruiter"],
  });

  const apply = await createApply({ $t, body: { ...body, jobID: id } });

  return apply;
});
