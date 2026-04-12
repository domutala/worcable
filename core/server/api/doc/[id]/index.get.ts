import { defineEventHandler, sendStream } from "h3";
import { Readable } from "node:stream";
import { getDoc } from "~~/server/services/doc/get";

export default defineEventHandler(async (event) => {
  const $t = await useTranslation(event);
  const id = getRouterParam(event, "id") as string;
  const doc = await getDoc({ id, $t });

  //   event.node.res.setHeader("Content-Type", "application/octet-stream");
  event.node.res.setHeader("Content-Type", doc.type);
  event.node.res.setHeader("Content-Length", doc.size);

  const stream = Readable.from(doc.data);
  return sendStream(event, stream);
});
