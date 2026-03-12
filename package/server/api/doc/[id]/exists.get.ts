import { existsDoc } from "~~/server/services/doc/exists";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id") as string;
  if (!id) return false;

  return await existsDoc(id);
});
