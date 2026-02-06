import { pgTable, uuid, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";
import { ConfigCity, ConfigCurrency } from "~~/server/services/config_types";

export const config = pgTable("config", {
  id: uuid().primaryKey().defaultRandom(),
  orgName: varchar().$type<string>(),
  currency: varchar().default("XOF").notNull().$type<ConfigCurrency>(),
  cities: jsonb().default({}).notNull().$type<Record<string, ConfigCity>>(),

  createdAt: timestamp("created_at", { mode: "string", withTimezone: false })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "string", withTimezone: false })
    .defaultNow()
    .$onUpdate(() => new Date().toISOString())
    .notNull(),
});

export type Config = typeof config.$inferSelect;
