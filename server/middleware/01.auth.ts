import { eq, isNull, and, or } from "drizzle-orm";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  if (!event.path.startsWith("/api")) return;

  const $t = await useTranslation(event);
  const runtime = useRuntimeConfig();
  const authHeader = getRequestHeader(event, "authorization");
  const accesToken = getCookie(event, "access_token");

  let token = "";
  if (authHeader) token = authHeader.replace("Bearer ", "");
  else if (accesToken) token = accesToken;

  if (token) {
    const r = jwt.verify(token, runtime.secretKey) as any;
    const [session] = await db
      .select()
      .from(tables.session)
      .where(
        and(
          eq(tables.session.id, r.sessionID),
          or(isNull(tables.session.close), eq(tables.session.close, false)),
        ),
      );

    if (!session) {
      throw createError({
        statusCode: 403,
        statusMessage: $t("session.errors.not_athorized"),
      });
    }

    event.context.session = session;
  }
});
