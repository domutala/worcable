export * as z from "zod";
import * as z from "zod";

export function parseZod<T>(schema: z.ZodSchema<T>, body: any) {
  const parsed = schema.safeParse(body);

  if (parsed.error) {
    throw createError({
      statusCode: 400,
      data: {
        messages: parsed.error.issues.map((issue) => ({
          message: issue.message,
          path: issue.path[0],
        })),
      },
    });
  }

  return parsed.data;
}
