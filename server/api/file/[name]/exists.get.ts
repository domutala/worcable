import { defineEventHandler } from "h3";
import exists from "~~/server/services/file_exists";

export default defineEventHandler(async (event) => {
  const filename = getRouterParam(event, "name") as string;

  if (!exists) {
    throw createError({
      statusCode: 404,
      statusMessage: "file_not_found",
    });
  }

  return await exists(filename);
});
