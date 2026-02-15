import * as z from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];

export enum ApplyStatus {
  REJECTED = "rejected",
  INIT = "init",
  TO_CONTACT = "toContact",
  INTERVIEW = "interview",
  HIRED = "hired",
}

const availability = ["immediately", "1month", "2mois", "3mois", "other"];
const educationLevel = [
  "none",
  "bepCap",
  "baccalaureate",
  "bacPlus2",
  "bacPlus3",
  "bacPlus4",
  "bacPlus5",
  "doctorate",
];

export function getApplyDataShema($t: (string: string) => string) {
  const ApplyData = z.object({
    firstName: z
      .string($t("apply.items.firstName.errors.required"))
      .min(2, $t("apply.items.firstName.errors.min")),
    lastName: z
      .string($t("apply.items.lastName.errors.required"))
      .min(2, $t("apply.items.lastName.errors.required")),
    email: z.email($t("apply.items.email.errors.invalid")),
    phone: z.string($t("apply.items.email.errors.invalid")),

    avatar: z
      .any()
      .refine(
        (file) => ACCEPTED_AVATAR_TYPES.includes(file?.type),
        $t("apply.items.cv.errors.type"),
      )
      .refine(
        (file) => file?.size <= MAX_FILE_SIZE,
        $t("apply.items.avatar.errors.size"),
      )
      .optional(),

    cv: z
      .any()
      .refine(
        (file) => file !== undefined,
        $t("apply.items.cv.errors.required"),
      )
      .refine(
        (file) => file?.type === "application/pdf",
        $t("apply.items.avatar.errors.type"),
      )

      .refine(
        (file) => file?.size <= MAX_FILE_SIZE,
        $t("apply.items.cv.errors.size"),
      ),

    desiredGrossSalary: z
      .number($t("apply.items.desiredGrossSalary.errors.required"))
      .min(0, $t("apply.items.desiredGrossSalary.errors.invalid"))
      .max(200, $t("apply.items.desiredGrossSalary.errors.invalid")),

    availability: z.enum(
      availability,
      $t("apply.items.availability.errors.required"),
    ),

    educationLevel: z.enum(
      educationLevel,
      $t("apply.items.educationLevel.errors.required"),
    ),

    acceptCondition: z.boolean(
      $t("apply.items.acceptCondition.errors.required"),
    ),

    motivation: z
      .string($t("apply.items.motivation.errors.invalid"))
      .optional(),
  });

  return ApplyData;
}

export function getApplyShema($t: (string: string) => string) {
  const note = z
    .number($t("apply.note.errors.required"))
    .min(0, $t("apply.note.errors.required"))
    .max(200, $t("apply.note.errors.required"));

  const status = z
    .string($t("apply.errors.invalid_status"))
    .optional()
    .nullable();

  const data = getApplyDataShema($t);

  return { note, status, data };
}
