import {
  pgTable,
  uuid,
  timestamp,
  jsonb,
  varchar,
  integer,
} from "drizzle-orm/pg-core";
import { getApplyShema } from "../../services/apply_get_shema";
import * as z from "zod";

const { data, note, status } = getApplyShema((v) => v);

export const apply = pgTable("apply", {
  id: uuid().primaryKey().defaultRandom(),
  data: jsonb().notNull().$type<z.output<typeof data>>(),

  status: varchar().default("init").notNull().$type<z.output<typeof status>>(),
  allStatus: jsonb()
    .notNull()
    .default([])
    .$type<Array<{ status: z.output<typeof status>; date: string }>>(),

  jobID: uuid("job_id"),

  note: integer().$type<z.output<typeof note>>(),

  createdAt: timestamp("created_at", { mode: "string", withTimezone: false })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "string", withTimezone: false })
    .defaultNow()
    .$onUpdate(() => new Date().toISOString())
    .notNull(),
});

export type Apply = typeof apply.$inferSelect;
