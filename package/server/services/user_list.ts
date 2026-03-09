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

  if (query.q) {
    const tokens = normalize(query.q);
    const searchRegex = new RegExp(tokens, "i");
    filters.push({ normalizedFullname: { $regex: searchRegex } });
  }

  if (query.ids) {
    const ids: string[] =
      typeof query.ids === "string" ? query.ids.split(",") : query.ids;
    filters.push({ _id: { $in: ids.map((id) => new Types.ObjectId(id)) } });
  }

  if (query.filterBy) {
    const filterBy = (query.filterBy as string).split(";");

    for (const filter of filterBy) {
      const [key, value] = filter.split(":");

      if (key === "role") {
        filters.push({ role: value });
      }
    }
  }

  const pipe: PipelineStage[] = [getFacet(paginate), getProject(paginate)];

  if (filters.length) pipe.unshift({ $match: { $and: filters as any } });
  pipe.unshift({ $addFields: { id: { $toString: "$_id" } } });

  let results: IDataResult<User & { score: number }>;
  [results] = await collections.$User.aggregate(pipe);

  if (query.q) {
    const tokens = normalize(query.q);
    results.items = results.items.map((user) => {
      let score = 0;

      for (const token of tokens.split(" ")) {
        const s1 = [
          ...user.normalizedFullname.matchAll(new RegExp(token, "gi")),
        ].length;

        score += s1 * 3;
      }

      return { ...user, score };
    });

    results.items.sort((a, b) => b.score - a.score);
  }

  return results;
}
