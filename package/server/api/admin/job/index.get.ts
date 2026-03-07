import { getUserJobIDs } from "~~/server/services/job_get";
import { listJobs } from "~~/server/services/job_list";

export default defineEventHandler(async (event) => {
  const $t = await useTranslation(event);
  const query = getQuery(event);

  return await listJobs({
    $t,
    query: {
      ...query,
      ids: await getUserJobIDs({ $t, userID: event.context.session.user.id }),
    },
  });
});
