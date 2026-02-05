import { ApplyStatus } from "../database/schema";
import { getApplyData } from "../services/apply_get_data_shema";
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

  if (body.phone) body.phone = body.phone.toString();

  const $t = await useTranslation(event);
  const ZApplyData = getApplyData($t);

  const dataParsed = ZApplyData.safeParse(body);

  if (dataParsed.error) {
    throw createError({
      statusCode: 400,
      data: {
        messages: dataParsed.error.issues.map((issue) => ({
          message: issue.message,
          path: issue.path[0],
        })),
      },
    });
  }

  dataParsed.data.cv = await saveFile(dataParsed.data.cv);
  if (dataParsed.data.avatar) {
    dataParsed.data.avatar = await saveFile(dataParsed.data.avatar);
  }

  const [apply] = await db
    .insert(tables.apply)
    .values({
      status: ApplyStatus.INIT,
      allStatus: [{ status: ApplyStatus.INIT, date: new Date().toISOString() }],
      data: dataParsed.data,
    })
    .returning();

  return apply;
});
