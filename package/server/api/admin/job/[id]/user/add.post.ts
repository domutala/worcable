import { checkJobUserRole } from "~~/server/services/job_get";
import { getUserShema } from "~~/server/services/user_shema";
import { isValidObjectId } from "mongoose";

export default defineEventHandler(async (event) => {
  const $t = await useTranslation(event);
  const body = await readBody(event);
  const id = getRouterParam(event, "id") as string;

  await checkJobUserRole({
    $t,
    userID: event.context.session.user.id,
    jobID: id,
    role: ["admin"],
  });

  const { role } = getUserShema($t);
  const bodyParse = parseZod(
    z.object({
      userID: z
        .string($t("job_user.create.items.role.errors.invalid"))
        .refine(
          (val) => isValidObjectId(val),
          $t("job_user.create.items.role.errors.invalid"),
        ),
      role,
    }),
    body,
  );

  const exists = await collections.$JobUser.exists({
    userID: bodyParse.userID,
    jobID: id,
  });

  if (exists) {
    throw createError({
      statusCode: 404,
      data: { message: $t("job_user.errors.already_assigned") },
    });
  }

  const jobUser = await collections.$JobUser.create({
    ...bodyParse,
    jobID: id,
  });

  return jobUser;
});
