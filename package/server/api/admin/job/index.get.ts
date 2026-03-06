import { listJobs } from "~~/server/services/job_list";

export default defineEventHandler(async (event) => {
  const $t = await useTranslation(event);
  const query = getQuery(event);

  return await listJobs({ $t, query });
});
