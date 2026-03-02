import { getApply } from "~~/server/services/apply_get";

export default defineEventHandler(async (event) => {
  const $t = await useTranslation(event);
  const id = getRouterParam(event, "id") as string;

  return await getApply({ id, $t });
});
