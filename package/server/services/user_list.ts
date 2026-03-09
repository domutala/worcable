import { IDataResult } from "../interfaces";
import { User } from "../database/collections";
import { paginationBuilder } from "../tools/pagination_builder_from_query";
import { PipelineStage, QueryFilter, Types } from "mongoose";

export async function listUsers({
  query,
  $t,
}: {
  query: Record<string, any>;
  $t: (str: string) => string;
}) {
  await collections.$User.syncIndexes();

  const paginate = paginationBuilder(query);
  let filters: QueryFilter<any> = [];

  if (query.ids) {
    const ids: string[] =
      typeof query.ids === "string" ? query.ids.split(",") : query.ids;
    filters.push({ _id: { $in: ids.map((id) => new Types.ObjectId(id)) } });
  }

  const pipe: PipelineStage[] = [getFacet(paginate), getProject(paginate)];

  if (filters.length) pipe.unshift({ $match: { $and: filters as any } });
  pipe.unshift({ $addFields: { id: { $toString: "$_id" } } });

  let results: IDataResult<User & { score: number }>;
  [results] = await collections.$User.aggregate(pipe);

  return results;
}
