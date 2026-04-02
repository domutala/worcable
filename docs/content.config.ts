import { defineContentConfig, defineCollection, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    docs_en: defineCollection({
      type: "page",

      source: [{ include: "en/docs/**/*" }],

      schema: z.object({
        links: z
          .array(
            z.object({
              label: z.string(),
              icon: z.string(),
              to: z.string(),
              target: z.string().optional(),
            })
          )
          .optional(),
      }),
    }),

    docs_fr: defineCollection({
      type: "page",

      source: [{ include: "fr/docs/**/*" }],

      schema: z.object({
        links: z
          .array(
            z.object({
              label: z.string(),
              icon: z.string(),
              to: z.string(),
              target: z.string().optional(),
            })
          )
          .optional(),
      }),
    }),
  },
});
