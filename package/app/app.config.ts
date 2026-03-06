const inputClass = [
  "rounded-min p-5 px-7 bg-default w-full min-h-17",
  "focus:ring-1 focus:ring-accented/60 focus-visible:ring-1 focus-visible:ring-accented/60 ring-default",
  "has-focus-visible:ring-1 has-focus-visible:ring-accented/60",
].join(" ");

//
export default defineAppConfig({
  site: { name: "Worcable" },

  ui: {
    colors: {
      primary: "orange",
      neutral: "neutral",
    },

    input: {
      slots: { root: "w-full" },

      compoundVariants: [{ class: inputClass }, { size: "xl" }],
    },
    inputTags: {
      compoundVariants: [{ class: inputClass }, { size: "xl" }],
      slots: {
        item: "rounded-lg ring-0 py-2 pl-3",
        itemText: "mr-2",
        itemDelete: "cursor-pointer",
      },
    },
    select: {
      compoundVariants: [{ class: inputClass }, { size: "xl" }],
    },
    textarea: {
      compoundVariants: [{ class: inputClass }, { size: "xl" }],
    },

    formField: {
      slots: { help: "px-3", error: "px-3", label: "px-3" },
    },

    button: {
      defaultVariants: {
        size: "xl",
        variant: "soft",
        color: "neutral",
      },

      compoundVariants: [{ class: "rounded-default cursor-pointer" }],
    },

    modal: {
      slots: { content: "rounded-max" },
    },

    drawer: {
      slots: {
        handle: "mt-1! hidden!",
        content: "rounded-t-max! overflow-hidden!",
      },
    },
  },
});
