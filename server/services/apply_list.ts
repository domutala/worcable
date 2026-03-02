import { IDataResult } from "../interfaces";
import { paginationBuilder } from "../tools/pagination_builder_from_query";
import { getJob } from "./job_get";
import { Apply, JobDocument } from "../database/collections";
import { isValidObjectId, PipelineStage, QueryFilter, Types } from "mongoose";

export async function listApplys({
  query,
  $t,
}: {
  query: Record<string, any>;
  $t: (str: string) => string;
}) {
  await collections.$Apply.syncIndexes();

  const { offset, page, pageSize, all } = paginationBuilder(query);
  let filters: QueryFilter<any> = [];
  let job: JobDocument | undefined;

  const { jobID } = query;
  if (jobID && isValidObjectId(jobID)) {
    job = await getJob({ id: jobID, $t });
    filters.push({ jobID: new Types.ObjectId(jobID) });
  }

  if (query.q) {
    const tokens = normalize(query.q);
    const searchRegex = new RegExp(tokens, "i");
    filters.push({ normalizedFullname: { $regex: searchRegex } });
  }

  if (query.filterBy) {
    const [key, value] = query.filterBy.split(":");

    if (key === "status" && job) {
      if (!value || value === "null") {
        filters.push({
          $or: [
            { status: { $nin: job.applyStatus.map((st) => st.key) } },
            { status: null },
          ],
        });
      } else {
        filters.push({ status: value });
      }
    }
  }

  const pipe: PipelineStage[] = [
    getFacet(offset, pageSize, all),
    getProject(page, pageSize),
  ];

  if (filters.length) pipe.unshift({ $match: { $and: filters as any } });
  pipe.unshift({ $addFields: { id: { $toString: "$_id" } } });

  let results: IDataResult<Apply & { score: number }>;
  [results] = await collections.$Apply.aggregate(pipe);

  if (query.q) {
    const tokens = normalize(query.q);

    results.items = results.items.map((job) => {
      let score = 0;

      for (const token of tokens.split(" ")) {
        const s1 = [...job.normalizedFullname.matchAll(new RegExp(token, "gi"))]
          .length;

        score += s1 * 3;
      }

      return { ...job, score };
    });

    results.items.sort((a, b) => b.score - a.score);
  }

  return results;
}
