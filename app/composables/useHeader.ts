// store.ts
import { createGlobalState } from "@vueuse/core";
import { shallowRef } from "vue";

export const useHeader = createGlobalState(() => {
  const color = shallowRef<"white" | "black">("white");

  function setColor(value: "white" | "black") {
    color.value = value;
  }

  return { color, setColor };
});
