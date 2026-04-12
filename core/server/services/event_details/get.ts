import { isValidObjectId } from "mongoose";

export async function getEventDetails({
  id,
  $t,
}: {
  id: string;
  $t: (str: string) => string;
}) {
  if (!id || !isValidObjectId(id)) {
    throw createError({
      statusCode: 400,
      data: { message: $t("listen.errors.invalid_id") },
    });
  }

  const eventDetails = await collections.$EventDetails.findById(id);

  if (!eventDetails) {
    throw createError({
      statusCode: 404,
      data: { message: $t("event_details.errors.event_details_not_found") },
    });
  }

  return eventDetails;
}
