export default defineEventHandler(async (event) => {
  deleteCookie(event, "access_token", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });

  if (!event.context.session) return;

  await collections.$Session.updateOne(
    { _id: event.context.session.id },
    { close: true },
  );

  return;
});
