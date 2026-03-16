export * as z from "zod";
export type { output as ZodOutput } from "zod";

import * as z from "zod";

export async function parseZod<T>(schema: z.ZodSchema<T>, body: any) {
  const parsed = await schema.safeParseAsync(body);

  if (parsed.error) {
    console.log(
      body,

      parsed.error.issues.map((issue) => ({
        message: issue.message,
        path: issue.path[0],
      })),
    );

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
