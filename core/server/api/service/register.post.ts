import jwt from "jsonwebtoken";
import { newSeassion } from "~~/server/services/session_create";

export default defineEventHandler(async (event) => {
  const $t = await useTranslation(event);
  const runtime = useRuntimeConfig(event);
  const token = getRequestHeader(event, "x-service-token") as string;
  let tokenDecoded!: { id: string; type: "service" };

  try {
    tokenDecoded = jwt.verify(token, runtime.secretKey) as any;
    if (tokenDecoded.type !== "service") throw "";
  } catch (error) {
    throw createError({
      statusCode: 403,
      statusMessage: $t("service.errors.invalid_token"),
    });
  }

  const _token = await newSeassion({ serviceID: tokenDecoded.id });

  return { token: _token };
});
