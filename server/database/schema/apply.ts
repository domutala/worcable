import { pgTable, uuid, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";
import { getApplyData } from "~~/server/services/apply_get_data_shema";
import * as z from "zod";

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
