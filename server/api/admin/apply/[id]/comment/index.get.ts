import { listApplyComments } from "~~/server/services/apply_comment_list";

export default defineEventHandler(async (event) => {
  const $t = await useTranslation(event);
  const query = getQuery(event);
  const applyID = getRouterParam(event, "id") as string;

  return await listApplyComments({ $t, query: { ...query, applyID } });
});
