import { EventDetailsDocument } from "~~/server/database/collections";

export function listenEvent(details: EventDetailsDocument) {
  if (eventListeners.includes(details.id)) return;

  emitter.on(details.event, (data: any) => {
    $fetch(details.cbURL, { method: "post", body: data, headers: {} }).catch(
      () => {},
    );
  });

  eventListeners.push(details.id);
}
