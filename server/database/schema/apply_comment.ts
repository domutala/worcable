import { pgTable, uuid, timestamp, text, jsonb } from "drizzle-orm/pg-core";
import { getApplyCommentSchema } from "../../services/apply_comment_schema";
import * as z from "zod";
import { apply } from "./apply";

const { comment } = getApplyCommentSchema((str) => str);

export const applyComment = pgTable("apply_comment", {
  id: uuid().primaryKey().defaultRandom(),

  comment: text().$type<z.output<typeof comment>>().notNull(),

  author: jsonb()
    .default({})
    .$type<{
      candidate?: boolean;
      user?: string;
      author?: { name?: string; avatar?: string; email?: string };
    }>()
    .notNull(),

  // TODO: Ajouter ON_DELETE:CASCADE
  applyID: uuid("apply_id")
    .references(() => apply.id)
    .notNull(),

  createdAt: timestamp("created_at", { mode: "string", withTimezone: false })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "string", withTimezone: false })
    .defaultNow()
    .$onUpdate(() => new Date().toISOString())
    .notNull(),
});

export type ApplyComment = typeof applyComment.$inferSelect;
