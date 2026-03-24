import { getJob } from "~~/server/services/job/get";

export default defineEventHandler(async (event) => {
  const $t = await useTranslation(event);
  const id = getRouterParam(event, "id") as string;

  return await getJob({
    id,
    $t,
    userID: event.context.session.user.id,
  });
});
