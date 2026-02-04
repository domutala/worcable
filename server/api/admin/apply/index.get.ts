import { listApplys } from "~~/server/database/schema";

export default defineEventHandler(async (event) => {
  const $t = await useTranslation(event);
  const query = getQuery<{
    page?: string;
    pageSize?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    jobID: string;
    filterBy?: string;
  }>(event);

  return await listApplys({ $t, query });
});
