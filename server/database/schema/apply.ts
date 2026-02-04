import { IDataResult, UploadedFile } from "./../../interfaces";
import { pgTable, uuid, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";
import * as z from "zod";
import _ from "lodash";
import { paginationBuilderFromQuery } from "~~/server/tools/pagination_builder_from_query";
import { count } from "drizzle-orm";

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

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function getApplyData($t: (string: string) => string) {
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
      .min(20000)
      .max(120000),

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

const ZApplyData = getApplyData((v) => v);
type IApplyData = z.output<typeof ZApplyData>;

export enum ApplyStatus {
  REJECTED = "rejected",
  INIT = "init",
  TO_CONTACT = "toContact",
  INTERVIEW = "interview",
  HIRED = "hired",
}

export const ApplyStatusColors = {
  rejected: "#ff0000",
  init: "#0050da",
  toContact: "#a41aff",
  interview: "#F59E0B",
  hired: "#18ca00",
};

export const ZApplyStaus = z.enum(ApplyStatus);

export const apply = pgTable("apply", {
  id: uuid().primaryKey().defaultRandom(),
  data: jsonb().notNull().$type<IApplyData>(),

  status: varchar().default("init").notNull().$type<ApplyStatus>(),
  allStatus: jsonb()
    .notNull()
    .default([])
    .$type<Array<{ status: ApplyStatus; date: string }>>(),

  jobID: uuid("job_id"),

  createdAt: timestamp("created_at", { mode: "string", withTimezone: false })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "string", withTimezone: false })
    .defaultNow()
    .$onUpdate(() => new Date().toISOString())
    .notNull(),
});

export type Apply = typeof apply.$inferSelect;

export async function listApplys({
  query,
  $t,
}: {
  query: Record<string, any>;
  $t: (str: string) => string;
}) {
  const sortableColumns = {
    status: tables.apply.status,
    createdAt: tables.apply.createdAt,
    updatedAt: tables.apply.updatedAt,
  };

  const { limit, offset, page, pageSize, sortOrder } =
    paginationBuilderFromQuery(query, sortableColumns);

  const itemsQuery = db.select().from(tables.apply).orderBy(sortOrder);
  const totalQuery = db.select().from(tables.apply).orderBy(sortOrder);

  itemsQuery.limit(limit).offset(offset);
  // totalQuery.limit(limit).offset(offset);

  const itemsWhere: any[] = [];
  const totalWhere: any[] = [];

  const { jobID } = query;
  if (jobID) {
    if (!z.uuid().safeParse(jobID).success) {
      throw createError({
        statusCode: 400,
        data: { message: $t("job.errors.invalid_id") },
      });
    }

    itemsWhere.push(eq(tables.apply.jobID, jobID));
    totalWhere.push(eq(tables.apply.jobID, jobID));
  }

  if (query.filterBy) {
    const filterableColumns = {
      status: tables.apply.status,
    };

    const [key, value] = query.filterBy.split(":");
    const filterKey =
      filterableColumns[key as "status"] ?? filterableColumns.status;

    itemsWhere.push(eq(filterKey, value));
    totalWhere.push(eq(filterKey, value));
  }

  itemsQuery.where(and(...itemsWhere));
  totalQuery.where(and(...totalWhere));

  const applys = await itemsQuery;
  const total = await totalQuery;

  const result: IDataResult<Apply> = {
    items: applys,
    page,
    pageSize,
    total: total.length,
    totalPages: Math.ceil(total.length / pageSize),
  };

  return result;
}
