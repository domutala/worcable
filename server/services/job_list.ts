import { desc, getColumns } from "drizzle-orm";
import { Job } from "../database/schema";
import { IDataResult } from "../interfaces";
import { paginationBuilderFromQuery } from "../tools/pagination_builder_from_query";

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

  const search = ((query.q as string) || "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .replace(/  +/g, " ")
    .toLowerCase()
    .split(" ")
    .join(" | ");
  const matchQuery = sql`
    (
      setweight(to_tsvector('simple', f_normalize(${tables.job.title})), 'A') ||
      setweight(to_tsvector('simple', f_normalize(${tables.job.jobDescription})), 'B') ||
      setweight(to_tsvector('simple', f_normalize(${tables.job.candidateProfile})), 'C')
    ),
    to_tsquery('simple', ${search})
  `;

  const querySql = db
    .select({
      ...getColumns(tables.job),
      rank: sql`ts_rank(${matchQuery})`,
      rankCd: sql`ts_rank_cd(${matchQuery})`,
    })
    .from(tables.job)
    .orderBy((t) => (query.q ? desc(t.rank) : sortOrder));

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
    const w = sql`(
      setweight(to_tsvector('simple', f_normalize(${tables.job.title})), 'A') ||
      setweight(to_tsvector('simple', f_normalize(${tables.job.jobDescription})), 'B') ||
      setweight(to_tsvector('simple', f_normalize(${tables.job.candidateProfile})), 'C'))
      @@ to_tsquery('simple', ${search}
    )`;
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
