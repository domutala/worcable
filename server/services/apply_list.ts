import { isNull, notInArray } from "drizzle-orm";
import { Apply } from "../database/schema";
import { IDataResult } from "../interfaces";
import { paginationBuilderFromQuery } from "../tools/pagination_builder_from_query";
import * as z from "zod";
import { getJob } from "./job_get";
import { Job } from "../mongoose/collectioons";

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

  let job: Job | undefined = undefined;

  const { jobID } = query;
  if (jobID) {
    job = await getJob({ id: jobID, $t });
    itemsWhere.push(eq(tables.apply.jobID, jobID));
    totalWhere.push(eq(tables.apply.jobID, jobID));
  }

  if (query.filterBy) {
    const filterableColumns = {
      status: tables.apply.status,
    };

    const [key, value] = query.filterBy.split(":");

    if (key === "status") {
      if (!job) {
        throw createError({
          statusCode: 404,
          data: { message: $t("job.errors.job_not_found") },
        });
      }

      if (!value || value === "null") {
        const w = or(
          isNull(tables.apply.status),
          notInArray(
            tables.apply.status,
            job.applyStatus.map((st) => st.key),
          ),
        );

        itemsWhere.push(w);
        totalWhere.push(w);
      } else {
        const filterKey =
          filterableColumns[key as "status"] ?? filterableColumns.status;

        itemsWhere.push(eq(filterKey, value));
        totalWhere.push(eq(filterKey, value));
      }
    }
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
