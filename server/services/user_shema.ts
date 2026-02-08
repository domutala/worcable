import * as z from "zod";

export const ZUser = z.object({
  id: z.uuid(),
  email: z.email().nullable().optional(),
  avatar: z.string().nullable().optional(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
});
