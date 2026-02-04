import { listApplys } from "~~/server/database/schema";

export default defineEventHandler(async (event) => {
  const query = getQuery<{
    page?: string;
    pageSize?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }>(event);

  const $t = await useTranslation(event);
  const jobID = getRouterParam(event, "id") as string;

  return await listApplys({ $t, query: { ...query, jobID } });
});
