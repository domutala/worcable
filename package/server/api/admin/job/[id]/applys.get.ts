import { listApplys } from "~~/server/services/apply_list";
import { getJob } from "~~/server/services/job/get";

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
    userID: event.context.session.user.id,
  });

  return await listApplys({ $t, query: { ...query, jobID } });
});
