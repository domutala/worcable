import onFetchError from "~/tools/onFetchError";
import type { User } from "~~/server/database/schema";

const store = defineStore(
  "session",
  () => {
    const token = ref<string | null>(null);
    const user = ref<User | null>(null);

    async function init() {
      try {
        const result = await $fetch<{ user: User }>("/api/auth");
        setUser(result.user);
      } catch (error) {
        setToken();
        setUser();
      }
    }

    function setToken(value?: string) {
      token.value = value || null;
      if (token.value) cookieStore.set("access_token", token.value);
      else cookieStore.delete("access_token");
    }

    function setUser(value?: User) {
      user.value = value || null;

      if (!user.value && Use.route.path.startsWith("/admin")) {
        navigateTo(Use.localePath({ name: "login" }));
      }
    }

    async function login(data: { email: string; password: string }) {
      const result = await $fetch<{ token: string; user: User }>("/api/login", {
        method: "post",
        body: data,
      });

      setToken(result.token);
      setUser(result.user);

      return result;
    }

    const logouting = ref(false);
    async function logout() {
      try {
        logouting.value = true;

        await $fetch("/api/logout", {
          method: "post",
          headers: { authorization: token.value! },
        });

        setToken();
        setUser();
      } catch (error) {
        onFetchError(error);
      } finally {
        logouting.value = false;
      }
    }

    return {
      init,

      token,
      setToken,
      login,

      user,
      setUser,

      logouting,
      logout,
    };
  },
  {},
);

export default store;
