const inputClass = [
  "rounded-default p-5 px-7 bg-surface",
  "focus:ring-1 focus:ring-accented/60 focus-visible:ring-1 focus-visible:ring-accented/60 ring-transparent",
  "has-focus-visible:ring-1 has-focus-visible:ring-accented/60",
].join(" ");

//
export default defineAppConfig({
  site: { name: "Worcable" },

  ui: {
    colors: {
      primary: "red",
      neutral: "neutral",
    },

    input: {
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
      compoundVariants: [
        { class: "roundex-default cursor-pointer" },
        { size: "xl" },
        { variant: "soft" },
        { color: "neutral" },
      ],
    },
  },
});
