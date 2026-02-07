import { Apply } from "../database/schema";
import { IDataResult } from "../interfaces";
import { paginationBuilderFromQuery } from "../tools/pagination_builder_from_query";
import * as z from "zod";

export async function listApplys({
  query,
  $t,
}: {
  query: Record<string, any>;
  $t: (str: string) => string;
}) {
  const sortableColumns = {
    note: tables.apply.note,
    status: tables.apply.status,
    createdAt: tables.apply.createdAt,
    updatedAt: tables.apply.updatedAt,
  };

  const { limit, offset, page, pageSize, sortOrder } =
    paginationBuilderFromQuery(query, sortableColumns);

  const itemsQuery = db.select().from(tables.apply).orderBy(sortOrder);
  const totalQuery = db.select().from(tables.apply).orderBy(sortOrder);

  itemsQuery.limit(limit).offset(offset);
  // totalQuery.limit(limit).offset(offset);

  const itemsWhere: any[] = [];
  const totalWhere: any[] = [];

  const { jobID } = query;
  if (jobID) {
    if (!z.uuid().safeParse(jobID).success) {
      throw createError({
        statusCode: 400,
        data: { message: $t("job.errors.invalid_id") },
      });
    }

    itemsWhere.push(eq(tables.apply.jobID, jobID));
    totalWhere.push(eq(tables.apply.jobID, jobID));
  }

  if (query.filterBy) {
    const filterableColumns = {
      status: tables.apply.status,
    };

    const [key, value] = query.filterBy.split(":");
    const filterKey =
      filterableColumns[key as "status"] ?? filterableColumns.status;

    itemsWhere.push(eq(filterKey, value));
    totalWhere.push(eq(filterKey, value));
  }

  if (query.q) {
    const q = query.q
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase();

    const w = sql`
      regexp_replace(
        unaccent(
          lower(
            COALESCE(${tables.apply.data}->>'firstName','') ||
            COALESCE(${tables.apply.data}->>'lastName','')
          )
        ),
        '[^a-z0-9]',
        '',
        'g'
      )
      LIKE '%' || regexp_replace(
        unaccent(lower(${q})),
        '[^a-z0-9]',
        '',
        'g'
      ) || '%'
    `;

    itemsWhere.push(w);
    totalWhere.push(w);
  }

  itemsQuery.where(and(...itemsWhere));
  totalQuery.where(and(...totalWhere));

  const applys = await itemsQuery;
  const total = await totalQuery;

  const result: IDataResult<Apply> = {
    items: applys,
    page,
    pageSize,
    total: total.length,
    totalPages: Math.ceil(total.length / pageSize),
  };

  return result;
}
