import { isValidObjectId } from "mongoose";
import { EventDetailsDocument } from "~~/server/database/collections";
import { getEventDetails } from "~~/server/services/event_details/get";
import { listenEvent } from "~~/server/services/event_details/listen";

export default defineEventHandler(async (event) => {
  const $t = await useTranslation(event);
  const body = await readBody(event);

  const schema = z.object({
    cbURL: z.url(),
    event: z.enum([
      "job:new",
      "job:update",
      "job:status-change",

      "apply:new",
      "apply:note",
      "apply:status-change",

      "comment:new",
    ]),
    uid: z.string().min(2).max(250),

    cbHeaders: z.record(z.string(), z.any()).optional(),
  });

  // let details: EventDetailsDocument | undefined = undefined;
  const options = await parseZod(schema, body);
  let details = await collections.$EventDetails.findOne({ uid: options.uid });

  if (!details) details = await collections.$EventDetails.create(options);
  else await details.updateOne(options);

  listenEvent(details);

  return { token: details.id };
});
