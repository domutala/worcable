import { defineEventHandler, readBody, createError } from "h3";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

  const [user] = await db
    .select()
    .from(tables.user)
    .where(eq(tables.user.email, body.email));

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

  const [session] = await db
    .insert(tables.session)
    .values({ userID: user.id })
    .returning({ id: tables.session.id });

  const token = jwt.sign({ sessionID: session.id }, runtime.secretKey);
  return { token, user };
});
