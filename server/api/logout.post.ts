export default defineEventHandler(async (event) => {
  deleteCookie(event, "access_token", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });

  if (!event.context.session) return;

  await db
    .update(tables.session)
    .set({ close: false })
    .where(eq(tables.session.id, event.context.session.id));

  return;
});
