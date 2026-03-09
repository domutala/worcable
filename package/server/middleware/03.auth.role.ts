export default defineEventHandler(async (event) => {
  const path = event.path;
  const method = event.method;

  // 1. Find if the current path matches any defined security rules
  const rule = routeRules.find((r) =>
    r.pattern instanceof RegExp
      ? r.pattern.test(path)
      : path.startsWith(r.pattern),
  );

  // If no rule matches, allow the request to proceed
  if (!rule) return;

  // 2. Check if the current HTTP method is subject to restriction
  if (rule.methods.includes(method)) {
    const session = event.context.session;

    // 3. Verify user authentication and authorization
    // Deny access if user is not logged in or lacks the required role
    if (!session?.user || !rule.roles.includes(session.user.role)) {
      const $t = await useTranslation(event);

      throw createError({
        statusCode: 403,
        statusMessage: $t("session.errors.not_authorized"),
      });
    }
  }
});
