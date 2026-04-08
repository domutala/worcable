import { EventDetailsDocument } from "~~/server/database/collections";

export function listenEvent(details: EventDetailsDocument) {
  if (!eventListeners.includes(details.uid)) {
    emitter.on(details.event, (data: any) => {
      $fetch(details.cbURL, {
        method: "post",
        body: data,
        headers: details.cbHeaders,
      }).catch((error) => {
        console.log(error);
      });
    });

    eventListeners.push(details.uid);
  }

  emitter.emit(details.event, { test: true });
}
