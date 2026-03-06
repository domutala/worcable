import { getUserShema } from "~~/server/services/user_shema";
import jwt from "jsonwebtoken";
import * as z from "zod";

export default defineEventHandler(async (event) => {
  const $t = await useTranslation(event);
  const runtime = useRuntimeConfig(event);
  const body = await readBody(event);

  const { email, role } = getUserShema($t);
  const schema = z.object({ email, role });
  const bodyParsed = schema.safeParse(body);

  if (bodyParsed.error) {
    throw createError({
      statusCode: 400,
      data: {
        messages: bodyParsed.error.issues.map((issue) => ({
          message: issue.message,
          path: issue.path[0],
        })),
      },
    });
  }

  if (await collections.$User.exists({ email: bodyParsed.data.email })) {
    throw createError({
      statusCode: 404,
      data: { message: $t("user.invite.errors.user_already_exists") },
    });
  }

  const token = jwt.sign({ user: bodyParsed.data }, runtime.secretKey, {
    // expiresIn: "5d",
  });
  console.log(token);

  // todo: envoyer un email de validation

  return;
});
