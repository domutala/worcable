import * as z from "zod";
import { getApply } from "~~/server/services/apply_get";
import { getApplyShema } from "~~/server/services/apply_get_shema";

export default defineEventHandler(async (event) => {
  const $t = await useTranslation(event);
  const id = getRouterParam(event, "id") as string;
  const body = await readBody(event);
  const apply = await getApply({ id, $t });

  const { status: schema } = getApplyShema($t);
  const parsedBody = z.object({ to: schema }).safeParse(body);

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

  const allStatus = apply.allStatus;
  allStatus.push({
    status: parsedBody.data.to,
    date: new Date().toISOString(),
  });

  await collections.$Apply.updateOne(
    { _id: id },
    { status: parsedBody.data.to, allStatus },
  );

  return await getApply({ id, $t });
});
