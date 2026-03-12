import { isValidObjectId } from "mongoose";

export async function getDoc({
  id,
  $t,
}: {
  id: string;
  $t: (str: string) => string;
}) {
  if (!id || !isValidObjectId(id)) {
    throw createError({
      statusCode: 400,
      data: { message: $t("doc.errors.invalid_id") },
    });
  }

  const doc = await collections.$Doc.findById(id);

  if (!doc) {
    throw createError({
      statusCode: 404,
      data: { message: $t("doc.errors.doc_not_found") },
    });
  }

  return doc;
}
