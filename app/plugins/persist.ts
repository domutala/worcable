import type { Pinia } from "pinia";
import { useCookies } from "@vueuse/integrations/useCookies";

export default defineNuxtPlugin({
  name: "persist",

  async setup({ $pinia }) {
    const pinia = $pinia as Pinia;

    pinia.use((context) => {
      const cookies = useCookies([context.store.$id]);
      const oldData = cookies.getAll();

      if (oldData) {
        for (const key of Object.keys(oldData)) {
          context.store[key] = oldData[key];
        }
      }

      context.store.$subscribe((_mutation, state) => {
        for (const key of Object.keys(state)) {
          cookies.set(key, state[key]);
        }
      });
    });
  },

  env: {
    islands: true,
  },
});
