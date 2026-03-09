import { listUsers } from "~~/server/services/user_list";

export default defineEventHandler(async (event) => {
  const $t = await useTranslation(event);
  const query = getQuery(event);

  return await listUsers({ $t, query });
});
