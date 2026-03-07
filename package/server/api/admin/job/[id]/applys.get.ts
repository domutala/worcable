import { listApplys } from "~~/server/services/apply_list";
import { getJob, getUserJobIDs } from "~~/server/services/job_get";

export default defineEventHandler(async (event) => {
  const query = getQuery<{
    page?: string;
    pageSize?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }>(event);

  const $t = await useTranslation(event);
  const jobID = getRouterParam(event, "id") as string;

  await getJob({
    $t,
    id: jobID,
    query: {
      ids: await getUserJobIDs({ $t, userID: event.context.session.user.id }),
    },
  });

  return await listApplys({ $t, query: { ...query, jobID } });
});
