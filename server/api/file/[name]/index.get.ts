import { defineEventHandler, sendStream } from "h3";
import { createReadStream } from "node:fs";
import { getFile } from "~~/server/tools/get_file";

export default defineEventHandler(async (event) => {
  const filename = getRouterParam(event, "name") as string;
  const { filePath, exists, mimeType, size } = await getFile(filename);

  if (!exists) {
    throw createError({
      statusCode: 404,
      statusMessage: "file_not_found",
    });
  }

  event.node.res.setHeader(
    "Content-Disposition",
    `inline; filename="${filename}"`,
  );

  //   event.node.res.setHeader("Content-Type", "application/octet-stream");
  if (mimeType) event.node.res.setHeader("Content-Type", mimeType);
  if (size) event.node.res.setHeader("Content-Length", size);

  return sendStream(event, createReadStream(filePath));
});
