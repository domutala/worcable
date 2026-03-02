import * as z from "zod";
import { getApply } from "~~/server/services/apply_get";
import { getApplyShema } from "~~/server/services/apply_get_shema";

export default defineEventHandler(async (event) => {
  const $t = await useTranslation(event);
  const id = getRouterParam(event, "id") as string;
  const body = await readBody(event);

  await getApply({ id, $t });

  const { note: schema } = getApplyShema($t);
  const parsedBody = z.object({ note: schema }).safeParse(body);

  if (parsedBody.error) {
    throw createError({
      statusCode: 400,
      data: {
        messages: parsedBody.error.issues.map((issue) => ({
          message: issue.message,
          path: issue.path[0],
        })),
      },
    });
  }

  await collections.$Apply.updateOne(
    { _id: id },
    { note: parsedBody.data.note },
  );

  return await getApply({ id, $t });
});
