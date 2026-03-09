import { createJob } from "~~/server/services/job_create";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const $t = await useTranslation(event);
  return await createJob({ $t, userID: event.context.session.user.id, body });
});
