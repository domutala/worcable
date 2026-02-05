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

  const itemsQuery = db.select().from(tables.job).orderBy(sortOrder);
  const totalQuery = db.select().from(tables.job).orderBy(sortOrder);

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

  itemsQuery.where(and(...itemsWhere));
  totalQuery.where(and(...totalWhere));

  const jobs = await itemsQuery;
  const total = await totalQuery;

  const result: IDataResult<Job> = {
    items: jobs,
    page,
    pageSize,
    total: total.length,
    totalPages: Math.ceil(total.length / pageSize),
  };

  return result;
}
