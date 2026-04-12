import { listJobs } from "~~/server/services/job_list";

export default defineEventHandler(async (event) => {
  const $t = await useTranslation(event);
  const query = getQuery(event);
  query.userID = event.context.session.user?.id;
  query.serviceID = event.context.session.service?.id;

  return await listJobs({ $t, query });
});
