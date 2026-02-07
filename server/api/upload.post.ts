import saveFile from "../tools/save_file";

function parsePrimitiveValue(value: string): string | number | boolean | null {
  const trimmed = value.trim();

  // null
  if (trimmed === "null") return null;

  // boolean
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;

  // number (int ou float)
  if (!Number.isNaN(Number(trimmed))) return Number(trimmed);

  // string par défaut
  return value;
}

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
        acc[field.name!] = {
          filename: field.filename,
          data: field.data,
          type: field.type,
          size: field.data.length,
        };
      } else {
        const rawValue = field.data.toString();
        acc[field.name!] = parsePrimitiveValue(rawValue);
      }
      return acc;
    },
    {} as Record<string, any>,
  );

  if (!body.file) {
    throw createError({
      statusCode: 400,
      data: { message: $t("uploads.errors.invalid_file") },
    });
  }
  const file = await saveFile(body.file);
  return file;
});
