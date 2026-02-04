import { count } from "drizzle-orm";
import { readFileSync } from "node:fs";
import path from "node:path";
import { Job } from "~~/server/database/schema";
import { IDataResult } from "~~/server/interfaces";
import { paginationBuilderFromQuery } from "~~/server/tools/pagination_builder_from_query";

export default defineEventHandler(async (event) => {
  const query = getQuery<{
    page?: string;
    pageSize?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }>(event);

  const sortableColumns = {
    title: tables.job.title,
    createdAt: tables.job.createdAt,
    updatedAt: tables.job.updatedAt,
  };

  const { limit, offset, page, pageSize, sortOrder } =
    paginationBuilderFromQuery(query, sortableColumns);

  const itemsQuery = db.select().from(tables.job).orderBy(sortOrder);
  const totalQuery = db.select({ total: count() }).from(tables.job);

  itemsQuery.limit(limit).offset(offset);
  totalQuery.limit(limit).offset(offset);

  const jobs = await db.select().from(tables.job);
  const [{ total }] = await totalQuery.$dynamic();

  const result: IDataResult<Job> = {
    items: jobs,
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  };

  return result;
});
