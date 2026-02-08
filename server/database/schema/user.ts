import { pgTable, uuid, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { UploadedFile } from "~~/server/interfaces";

export const user = pgTable("user", {
  id: uuid().primaryKey().defaultRandom(),
  email: varchar().notNull(),
  avatar: jsonb().$type<UploadedFile>(),
  firstName: varchar().notNull(),
  lastName: varchar().notNull(),
  password: varchar(),

  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .defaultNow()
    .$onUpdate(() => new Date().toISOString())
    .notNull(),
});

export type User = typeof user.$inferSelect;
