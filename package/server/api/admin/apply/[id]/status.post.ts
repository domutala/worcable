import * as z from "zod";
import { getApply } from "~~/server/services/apply_get";
import { getApplyShema } from "~~/server/shared";
import { checkJobUserRole } from "~~/server/services/job/get";

export default defineEventHandler(async (event) => {
  const $t = await useTranslation(event);
  const id = getRouterParam(event, "id") as string;
  const body = await readBody(event);

  const { allStatus, jobID } = await getApply({ id, $t });
  await checkJobUserRole({
    $t,
    userID: event.context.session.user.id,
    jobID: jobID.toString(),
    role: ["admin", "recruiter"],
  });

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
