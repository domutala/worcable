import { asc, desc } from "drizzle-orm";
import { PgColumn } from "drizzle-orm/pg-core";

export function paginationBuilderFromQuery(
  query: {
    page?: string;
    pageSize?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  },
  sortableColumns: { [key: string]: PgColumn },
) {
  const page = Number(query.page ?? 1);
  const pageSize = Number(query.pageSize ?? 8);
  const safePage = Math.max(1, page);
  const safePageSize = Math.min(Math.max(1, pageSize), 100);
  const offset = (safePage - 1) * safePageSize;
  const limit = safePageSize;

  Object.values(sortableColumns)[0];
  const sortBy =
    query.sortBy && sortableColumns[query.sortBy as "title"]
      ? sortableColumns[query.sortBy as "title"]
      : sortableColumns.updatedAt;

  const sortOrder = query.sortOrder === "asc" ? asc(sortBy) : desc(sortBy);

  return {
    sortOrder,
    sortBy,

    limit,
    offset,
    page: safePage,
    pageSize: safePageSize,
  };
}

export function paginationBuilder(query: { page?: string; pageSize?: string }) {
  const page = Number(query.page ?? 1);
  const pageSize = Number(query.pageSize ?? 8);
  const safePage = Math.max(1, page);
  const safePageSize = Math.min(Math.max(1, pageSize), 100);
  const offset = (safePage - 1) * safePageSize;

  return {
    offset,
    page: safePage,
    pageSize: safePageSize,
  };
}
