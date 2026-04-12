import { getJob } from "~~/server/services/job/get";

export default defineEventHandler(async (event) => {
  const $t = await useTranslation(event);
  const id = getRouterParam(event, "id") as string;

  const query = {
    userID: event.context.session.user?.id,
    serviceID: event.context.session.service?.id,
  };

  const job = await getJob({ id, $t, ...query });
  return job;
});
