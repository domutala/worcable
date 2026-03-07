import { getJob, getUserJobIDs } from "~~/server/services/job_get";

export default defineEventHandler(async (event) => {
  const $t = await useTranslation(event);
  const id = getRouterParam(event, "id") as string;

  return await getJob({
    id,
    $t,
    query: {
      ids: await getUserJobIDs({ $t, userID: event.context.session.user.id }),
    },
  });
});
