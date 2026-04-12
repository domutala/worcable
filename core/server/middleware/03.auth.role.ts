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
    let role: RouteRuleRole | undefined = undefined;

    if (session.service) role = "service";
    else if (session.user) role = session.user.role;

    // 3. Verify user authentication and authorization
    // Deny access if user is not logged in or lacks the required role

    if (!role || rule.roles.includes(role)) {
      const $t = await useTranslation(event);
      throw createError({
        statusCode: 403,
        statusMessage: $t("session.errors.not_authorized"),
      });
    }
    if (!session?.user || !rule.roles.includes(session.user.role)) {
      const $t = await useTranslation(event);

      throw createError({
        statusCode: 403,
        statusMessage: $t("session.errors.not_authorized"),
      });
    }
  }
});
