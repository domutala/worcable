import { UserDocument } from "./../database/collections/user";
import { defineEventHandler, readBody, createError } from "h3";
import bcrypt from "bcryptjs";
import { createSeassion } from "../services/session_create";

export default defineEventHandler(async (event) => {
  const $t = await useTranslation(event);
  const runtime = useRuntimeConfig(event);
  const body = await readBody<{ email: string; password: string }>(event);

  if (!body.email || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: $t("login.errors.invalid_credentials"),
    });
  }

  const user = await collections.$User
    .findOne({
      email: body.email.toLowerCase().trim(),
    })
    .select("+password")
    .lean();

  if (!user || !user.password) {
    throw createError({
      statusCode: 401,
      statusMessage: $t("login.errors.invalid_credentials"),
    });
  }

  // Vérification du mot de passe
  const passwordMatch = await bcrypt.compare(
    body.password + runtime.secretKey,
    user.password,
  );

  if (!passwordMatch) {
    throw createError({
      statusCode: 401,
      statusMessage: $t("login.errors.invalid_credentials"),
    });
  }

  delete user.password;

  return await createSeassion(user as UserDocument);
});
