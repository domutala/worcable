import {
  pgTable,
  uuid,
  timestamp,
  varchar,
  text,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import * as z from "zod";
import { sql } from "drizzle-orm";

export enum JobContractTypeEnum {
  CDI = "CDI",
  CDD = "CDD",
  INTERNSHIP = "INTERNSHIP",
  FREELANCE = "FREELANCE",
  PART_TIME = "PART_TIME",
}

export enum JobNatureEnum {
  ONSITE = "ONSITE",
  REMOTE = "REMOTE",
  HYBRID = "HYBRID",
}

export const allowedPrefixedSkills = [
  "$nuxtjs",
  "$react",
  "$vue",
  "$nestjs",
  "$nextjs",
] as const;

export function getJobShema($t: (str: string) => string = (str) => str) {
  const skillSchema = z
    .string()
    .transform((skill) => skill.trim())
    .refine(
      (skill) => {
        // Cas 1 : commence par $
        if (skill.startsWith("$")) {
          return allowedPrefixedSkills.includes(
            skill.toLowerCase() as (typeof allowedPrefixedSkills)[number],
          );
        }

        // Cas 2 : skill libre
        return skill.length >= 2;
      },
      {
        message: $t("job.items.skills.errors.invalid"),
      },
    );

  const title = z
    .string($t("job.items.title.errors.required"))
    .min(3, $t("job.items.title.errors.min"))
    .max(150, $t("job.items.title.errors.max"));

  const companyDescription = z
    .string($t("job.items.companyDescription.errors.required"))
    .min(20, $t("job.items.companyDescription.errors.min"))
    .optional();

  const jobDescription = z
    .string($t("job.items.jobDescription.errors.required"))
    .min(50, $t("job.items.jobDescription.errors.min"));

  const contractType = z.enum(
    JobContractTypeEnum,
    $t("job.items.contractType.errors.invalid"),
  );

  const location = z
    .string($t("job.items.location.errors.required"))
    .min(2, $t("job.items.location.errors.min"));

  const jobNature = z.enum(
    JobNatureEnum,
    $t("job.items.jobNature.errors.invalid"),
  );

  const salary = z
    .tuple(
      [
        z.number().min(0, $t("job.items.salary.errors.invalidRange")),
        z.number().max(200, $t("job.items.salary.errors.invalidRange")),
      ],
      $t("job.items.salary.errors.invalid"),
    )
    .refine((value) => value[0] < value[1], {
      message: $t("job.items.salary.errors.invalidRange"),
      path: ["max"],
    })
    .optional();

  const skills = z.array(skillSchema).default([]).optional();

  const candidateProfile = z
    .string($t("job.items.candidateProfile.errors.required"))
    .min(30, $t("job.items.candidateProfile.errors.min"))
    .optional();

  const jobOfferSchema = z.object({
    title,
    companyDescription,
    contractType,
    jobDescription,
    location,
    jobNature,
    salary,
    skills,
    candidateProfile,
  });

  return {
    schema: jobOfferSchema,

    title,

    location,
    jobNature,
    contractType,
    salary,

    jobDescription,
    skills,

    candidateProfile,

    companyDescription,
  };
}

export const job = pgTable(
  "job",
  {
    id: uuid().primaryKey().defaultRandom(),

    title: text("title", {}).notNull(),

    companyDescription: text("company_description"),

    contractType: varchar("contract_type", { length: 20 })
      .notNull()
      .$type<JobContractTypeEnum>(),

    jobDescription: text("job_description").notNull(),

    location: varchar("location", { length: 100 }).notNull(),

    jobNature: varchar("job_nature", { length: 20 })
      .notNull()
      .$type<JobNatureEnum>(),

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
