import { pgTable, uuid, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";
import { getConfigSchema } from "../../services/config_get_shema";
import * as z from "zod";

const { logo, cities, currency } = getConfigSchema((v) => v);

export const config = pgTable("config", {
  id: uuid().primaryKey().defaultRandom(),

  orgName: varchar().$type<string>(),

  logo: jsonb().$type<z.output<typeof logo>>(),

  currency: varchar()
    .default("XOF")
    .notNull()
    .$type<z.output<typeof currency>>(),

  cities: jsonb().default([]).notNull().$type<z.output<typeof cities>>(),

  createdAt: timestamp("created_at", { mode: "string", withTimezone: false })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "string", withTimezone: false })
    .defaultNow()
    .$onUpdate(() => new Date().toISOString())
    .notNull(),
});

export type Config = typeof config.$inferSelect;
