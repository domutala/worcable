import { ApplyComment } from "../database/collections";
import { IDataResult } from "../interfaces";
import { paginationBuilder } from "../tools/pagination_builder_from_query";
import { getApply } from "./apply_get";
import { isValidObjectId, PipelineStage, QueryFilter, Types } from "mongoose";

export async function listApplyComments({
  query,
  $t,
}: {
  query: Record<string, any>;
  $t: (str: string) => string;
}) {
  const { offset, page, pageSize, all } = paginationBuilder(query);
  let filters: QueryFilter<any> = [];

  const { applyID } = query;
  if (applyID && isValidObjectId(applyID)) {
    await getApply({ id: applyID, $t });
    filters.push({ applyID: new Types.ObjectId(applyID) });
  }

  const pipe: PipelineStage[] = [
    getFacet(offset, pageSize, all),
    getProject(page, pageSize),
  ];

  if (filters.length) pipe.unshift({ $match: { $and: filters as any } });
  pipe.unshift({ $addFields: { id: { $toString: "$_id" } } });

  let results: IDataResult<ApplyComment & { score: number }>;
  [results] = await collections.$ApplyComment.aggregate(pipe);

  return results;
}
