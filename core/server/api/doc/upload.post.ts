import { saveDoc } from "~~/server/services/doc/save";

export default defineEventHandler(async (event) => {
  const runtime = useRuntimeConfig(event);
  const $t = await useTranslation(event);

  // const uploadsKey = getHeaders(event)["x-uploads-key"];
  // console.log(uploadsKey, runtime.uploadsKey);

  const form = await readMultipartFormData(event);
  if (!form) throw createError({ statusCode: 400 });

  const body = form.reduce(
    (acc, field) => {
      if (field.filename) {
        const e = {
          filename: field.filename,
          data: field.data,
          type: field.type,
          size: field.data.length,
        };

        acc[field.name!] = {
          filename: field.filename,
          data: field.data,
          type: field.type,
          size: field.data.length,
        };
      }
      return acc;
    },
    {} as Record<string, any>,
  );

  if (!body.doc) {
    throw createError({
      statusCode: 400,
      data: { message: $t("uploads.errors.invalid_file") },
    });
  }

  const doc = await saveDoc({ $t, doc: body.doc });
  return doc;
});
