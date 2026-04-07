import { listenEvent } from "../services/event_details/listen";

export default defineNitroPlugin(async (nitroApp) => {
  const eventDetails = await collections.$EventDetails.find();
  for (const details of eventDetails) listenEvent(details);
});
