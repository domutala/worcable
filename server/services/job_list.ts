import { desc } from "drizzle-orm";
import { Job } from "../database/schema";
import { IDataResult } from "../interfaces";
import { paginationBuilderFromQuery } from "../tools/pagination_builder_from_query";
import * as z from "zod";

export async function listJobs({
  query,
  $t,
}: {
  query: Record<string, any>;
  $t: (str: string) => string;
}) {
  const sortableColumns = {
    createdAt: tables.job.createdAt,
    updatedAt: tables.job.updatedAt,
  };

  const { limit, offset, page, pageSize, sortOrder } =
    paginationBuilderFromQuery(query, sortableColumns);

  const searchVector = sql`job.search_vector`;
  const querySql = db
    .select({
      id: tables.job.id,
      title: tables.job.title,
      jobDescription: tables.job.jobDescription,
      contractType: tables.job.contractType,
      location: tables.job.location,
      jobNature: tables.job.jobNature,
      salary: tables.job.salary,
      skills: tables.job.skills,
      candidateProfile: tables.job.candidateProfile,
      createdAt: tables.job.createdAt,
      updatedAt: tables.job.updatedAt,

      score: sql<number>`
        ts_rank_cd(
          ${searchVector},
          websearch_to_tsquery('simple', immutable_normalize(${query.q || ""}))
        )
      `.as("score"),
    })
    .from(tables.job)
    .orderBy(query.q ? desc(sql`score`) : sortOrder);

  const itemsQuery = querySql;
  const totalQuery = querySql;

  itemsQuery.limit(limit).offset(offset);

  const itemsWhere: any[] = [];
  const totalWhere: any[] = [];

  // if (query.filterBy) {
  //   const filterableColumns = {
  //     status: tables.job.status,
  //   };

  //   const [key, value] = query.filterBy.split(":");
  //   const filterKey =
  //     filterableColumns[key as "status"] ?? filterableColumns.status;

  //   itemsWhere.push(eq(filterKey, value));
  //   totalWhere.push(eq(filterKey, value));
  // }

  if (query.q) {
    const w = sql`${searchVector} @@ websearch_to_tsquery('simple', immutable_normalize(${query.q}))`;
    itemsWhere.push(w);
    totalWhere.push(w);
  }

  itemsQuery.where(and(...itemsWhere));
  totalQuery.where(and(...totalWhere));

  const jobs = await itemsQuery;
  const total = await totalQuery;

  const result: IDataResult<Job> = {
    items: jobs as any as Job[],
    page,
    pageSize,
    total: total.length,
    totalPages: Math.ceil(total.length / pageSize),
  };

  return result;
}
