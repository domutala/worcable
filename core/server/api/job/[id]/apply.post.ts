import { createApply } from "~~/server/services/apply/create";

export default defineEventHandler(async (event) => {
  const $t = await useTranslation(event);
  const id = getRouterParam(event, "id") as string;
  const body = await readBody(event);

  const apply = await createApply({ $t, body: { ...body, jobID: id } });

  return { id: apply.id };
});
