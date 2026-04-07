import { isValidObjectId } from "mongoose";
import { EventDetailsDocument } from "~~/server/database/collections";
import { getEventDetails } from "~~/server/services/event_details/get";
import { listenEvent } from "~~/server/services/event_details/listen";

import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  const $t = await useTranslation(event);
  const body = await readBody(event);

  const schema = z.object({
    cbURL: z.url(),
    event: z.enum(["job:create"]),
    token: z
      .custom<string>((e) => {
        if (typeof e === "undefined") return true;
        return isValidObjectId(e);
      })
      .optional(),
  });

  let details: EventDetailsDocument | undefined = undefined;
  const options = await parseZod(schema, body);

  if (options.token) details = await getEventDetails({ $t, id: options.token });
  if (!details) details = await collections.$EventDetails.create(options);

  listenEvent(details);

  const runtime = useRuntimeConfig(event);
  console.log(
    jwt.sign(
      { id: "69d54e1b010f5ccd164e0e79", type: "service" },
      runtime.secretKey,
    ),
  );

  return { token: details.id };
});
