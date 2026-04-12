import jwt from "jsonwebtoken";
import _ from "lodash";
import services from "~~/services.json";

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
    try {
      const r = jwt.verify(token, runtime.secretKey) as any;
      const session = await collections.$Session.findOne({
        _id: r.sessionID,
        close: false,
      });

      if (!session) {
        deleteCookie(event, "access_token", {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          path: "/",
        });
      } else {
        if (session.userID) {
          const user = await collections.$User.findById(session.userID);

          if (user?.active) {
            _.unset(user, "password");
            event.context.session = { ...session, user } as any;
          }
        } else if (session.serviceID) {
          const service = Object.values(services).find(
            (s) => s.id === session.serviceID,
          );

          if (service) {
            event.context.session = { ...session, service } as any;
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
});
