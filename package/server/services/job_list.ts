import { IDataResult } from "../interfaces";
import { Job } from "../database/collections";
import { paginationBuilder } from "../tools/pagination_builder_from_query";
import { PipelineStage, QueryFilter, Types } from "mongoose";
import { getUserJobIDs } from "./job/get";

export async function listJobs({
  query,
  $t,
}: {
  query: Record<string, any>;
  $t: (str: string) => string;
}) {
  await collections.$Job.syncIndexes();

  function normalizeSkills() {
    return {
      $addFields: {
        skillsNormalized: {
          $map: {
            input: { $ifNull: ["$skills", []] },
            as: "skill",

            in: {
              $toLower: {
                $replaceAll: {
                  input: {
                    $replaceAll: {
                      input: {
                        $replaceAll: {
                          input: {
                            $replaceAll: {
                              input: {
                                $replaceAll: {
                                  input: {
                                    $replaceAll: {
                                      input: `$$skill`,
                                      find: " ",
                                      replacement: "",
                                    },
                                  },
                                  find: ";",
                                  replacement: "",
                                },
                              },
                              find: "_",
                              replacement: "",
                            },
                          },
                          find: "-",
                          replacement: "",
                        },
                      },
                      find: ".",
                      replacement: "",
                    },
                  },
                  find: " ",
                  replacement: ",",
                },
              },
            },
          },
        },
      },
    };
  }

  function buildSkillsFilter(skiills: string[]) {
    skiills = skiills.map((skill) => normalize(skill).replaceAll(" ", ""));

    return {
      $and: [
        {
          $expr: {
            $gt: [
              {
                $size: {
                  $filter: {
                    input: "$skillsNormalized",
                    as: "skill",
                    cond: {
                      $gt: [
                        {
                          $size: {
                            $filter: {
                              input: skiills,
                              as: "search",
                              cond: {
                                $regexMatch: {
                                  input: "$$skill",
                                  regex: "$$search",
                                },
                              },
                            },
                          },
                        },
                        0,
                      ],
                    },
                  },
                },
              },
              0,
            ],
          },
        },
      ],
    };
  }

  const paginate = paginationBuilder(query);
  let filters: QueryFilter<any> = [];

  if (query.q) {
    const tokens = normalize(query.q);
    const searchRegex = new RegExp(tokens, "i");

    filters.push({
      $or: [
        { normalizedTitle: { $regex: searchRegex } },
        { jobDescription: { $regex: searchRegex } },
      ],
    });
  }

  if (query.skills) {
    filters.push(buildSkillsFilter(query.skills));
  }

  if (query.filterBy) {
    const filterBy = (query.filterBy as string).split(";");

    for (const filter of filterBy) {
      const [key, value] = filter.split(":");

      if (key === "status") {
        filters.push({ status: { $in: value.split(",") } });
      }
    }
  }

  if (query.ids) {
    const ids: string[] =
      typeof query.ids === "string" ? query.ids.split(",") : query.ids;
    filters.push({ _id: { $in: ids.map((id) => new Types.ObjectId(id)) } });
  }

  if (query.userID) {
    const ids = await getUserJobIDs({ $t, userID: query.userID });
    filters.push({ _id: { $in: ids.map((id) => new Types.ObjectId(id)) } });
  }

  const pipe: PipelineStage[] = [
    normalizeSkills(),
    getFacet(paginate),
    getProject(paginate),
  ];

  if (filters.length) pipe.unshift({ $match: { $and: filters as any } });
  pipe.unshift({ $addFields: { id: { $toString: "$_id" } } });

  let results: IDataResult<Job & { score: number }>;
  [results] = await collections.$Job.aggregate(pipe);

  if (query.q) {
    const tokens = normalize(query.q);

    results.items = results.items.map((job) => {
      let score = 0;

      for (const token of tokens.split(" ")) {
        const s1 = [...job.normalizedTitle.matchAll(new RegExp(token, "gi"))]
          .length;

        const s2 = [...job.jobDescription.matchAll(new RegExp(token, "gi"))]
          .length;

        score += s1 * 3 + s2;
      }

      return { ...job, score };
    });

    results.items.sort((a, b) => b.score - a.score);
  }

  return results;
}
