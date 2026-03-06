export default defineEventHandler(async (event) => {
  if (!event.context.session) return {};
  return { user: event.context.session.user };
});
