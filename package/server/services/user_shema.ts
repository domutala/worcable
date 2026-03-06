import * as z from "zod";

export const USER_ROLE = ["admin", "recruiter", "guest"] as const;

export function getUserShema($t: (string: string) => string) {
  const role = z.enum(USER_ROLE, $t("user.items.role.errors.invelid"));

  return { role };
}

export const ZUser = z.object({
  id: z.uuid(),
  email: z.email().nullable().optional(),
  avatar: z.string().nullable().optional(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
});
