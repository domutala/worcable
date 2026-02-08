import { pgTable, uuid, timestamp, boolean } from "drizzle-orm/pg-core";
import { user } from "./user";

export const session = pgTable("session", {
  id: uuid().primaryKey().defaultRandom(),
  close: boolean().default(false),
  createdAt: timestamp().defaultNow().notNull(),
  userID: uuid("user_id")
    .references(() => user.id)
    .notNull(),
});

export type Session = typeof session.$inferSelect;
