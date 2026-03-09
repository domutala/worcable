import { getUserShema } from "~~/server/services/user_shema";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../database/collections";
import _ from "lodash";
import { createSeassion } from "../services/session_create";

export default defineEventHandler(async (event) => {
  const $t = await useTranslation(event);
  const runtime = useRuntimeConfig(event);
  const body = await readBody(event);
  const token = body.token;

  let _user: User;

  try {
    const decode = jwt.verify(token, runtime.secretKey) as any;
    _user = decode.user;
  } catch (error) {
    throw createError({
      statusCode: 404,
      data: { message: $t("user.invite.errors.invalid_token") },
    });
  }

  const { schema: _schema, passwordEdit } = getUserShema($t);
  const schema = _schema.extend(passwordEdit.shape);
  const bodyParsed = schema.safeParse({
    ...body,
    email: _user.email,
    role: _user.role,
  });

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

  const password = await bcrypt.hash(
    bodyParsed.data.password + runtime.secretKey,
    12,
  );

  _.unset(bodyParsed.data, "password");
  _.unset(bodyParsed.data, "passwordRepeat");

  const user = await collections.$User.create({ ...bodyParsed.data, password });
  return await createSeassion(user);
});
