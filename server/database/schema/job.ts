import {
  pgTable,
  uuid,
  timestamp,
  varchar,
  text,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { getJobShema } from "~~/server/services/job_schema";
import * as z from "zod";

const { contractType, jobNature } = getJobShema();

export const job = pgTable(
  "job",
  {
    id: uuid().primaryKey().defaultRandom(),

    title: text("title", {}).notNull(),

    companyDescription: text("company_description"),

    contractType: varchar("contract_type", { length: 20 })
      .notNull()
      .$type<z.output<typeof contractType>>(),

    jobDescription: text("job_description").notNull(),

    location: varchar("location", { length: 100 }).notNull(),

    jobNature: varchar("job_nature", { length: 20 })
      .notNull()
      .$type<z.output<typeof jobNature>>(),

    salary: jsonb().$type<[number, number]>(),

    /**
     * Skills stockées sous forme de texte séparé
     * Exemple: "nodejs,$nestjs,postgres"
     * (ou à normaliser via table relationnelle – voir plus bas)
     */
    skills: text("skills").array().default([]).notNull(),

    candidateProfile: text("candidate_profile"),

    // searchVector: sql`job_search_vector`.as("searchVector"),

    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .$onUpdate(() => new Date().toISOString())
      .notNull(),
  },
  (table) => [
    index("search_index").using(
      "gin",
      sql`(
          setweight(to_tsvector('simple', f_normalize(${table.title})), 'A') ||
          setweight(to_tsvector('simple', f_normalize(${table.jobDescription})), 'B') ||
          setweight(to_tsvector('simple', f_normalize(${table.candidateProfile})), 'C')
      )`,
    ),
  ],
);

export type Job = typeof job.$inferSelect;
