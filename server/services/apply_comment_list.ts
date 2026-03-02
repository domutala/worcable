import { Apply, ApplyComment } from "../database/schema";
import { IDataResult } from "../interfaces";
import { paginationBuilderFromQuery } from "../tools/pagination_builder_from_query";
import * as z from "zod";
import { getApply } from "./apply_get";

export async function listApplyComments({
  query,
  $t,
}: {
  query: Record<string, any>;
  $t: (str: string) => string;
}) {
  const sortableColumns = {
    createdAt: tables.applyComment.createdAt,
    updatedAt: tables.applyComment.updatedAt,
  };

  const { limit, offset, page, pageSize, sortOrder } =
    paginationBuilderFromQuery(query, sortableColumns);

  const itemsQuery = db.select().from(tables.applyComment).orderBy(sortOrder);
  const totalQuery = db.select().from(tables.applyComment).orderBy(sortOrder);

  itemsQuery.limit(limit).offset(offset);
  // totalQuery.limit(limit).offset(offset);

  const itemsWhere: any[] = [];
  const totalWhere: any[] = [];

  const { applyID } = query;
  if (applyID) {
    const apply = await getApply({ id: applyID, $t });

    itemsWhere.push(eq(tables.applyComment.applyID, applyID));
    totalWhere.push(eq(tables.applyComment.applyID, applyID));
  }

  itemsQuery.where(and(...itemsWhere));
  totalQuery.where(and(...totalWhere));

  const applys = await itemsQuery;
  const total = await totalQuery;

  const result: IDataResult<ApplyComment> = {
    items: applys,
    page,
    pageSize,
    total: total.length,
    totalPages: Math.ceil(total.length / pageSize),
  };

  return result;
}
