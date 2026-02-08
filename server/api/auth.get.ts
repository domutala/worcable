export default defineEventHandler(async (event) => {
  const [user] = await db
    .select()
    .from(tables.user)
    .where(eq(tables.user.id, event.context.session.userID));

  return { user };
});
