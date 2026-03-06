export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie("access_token");

  if (to.path.startsWith("/admin") && !token) {
    return navigateTo(Use.localePath({ name: "login" }));
  }
});
