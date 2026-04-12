import { createJob } from "~~/server/services/job/create";
import emitter from "~~/server/utils/emitter";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const $t = await useTranslation(event);
  const job = await createJob({
    $t,
    userID: event.context.session.user?.id,
    serviceID: event.context.session.service?.id,
    body,
  });

  emitter.emit("job:create", job);

  return job;
});
