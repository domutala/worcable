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
        const user = await collections.$User.findById(session.userID);
        delete user?.password;

        if (user) {
          event.context.session = { ...session, user };
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
});
