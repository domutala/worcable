import { IDataResult } from "../interfaces";
import { paginationBuilder } from "../tools/pagination_builder_from_query";
import { useMongo } from "../mongoose";
import { _Job, JobDocument } from "../mongoose/models/job";
import { PipelineStage, QueryFilter } from "mongoose";

export async function listJobs({
  query,
  $t,
}: {
  query: Record<string, any>;
  $t: (str: string) => string;
}) {
  await useMongo();
  await _Job.syncIndexes();

  function tokenize(str: string) {
    return str
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ")
      .replace(/[-_.*+?^${}()|[\]\\]/g, "");
  }

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
    skiills = skiills.map((skill) => tokenize(skill).replaceAll(" ", ""));

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

  const sortableColumns = {
    createdAt: tables.job.createdAt,
    updatedAt: tables.job.updatedAt,
  };

  const { offset, page, pageSize } = paginationBuilder(query);
  let filters: QueryFilter<any> = [];

  if (query.q) {
    const tokens = tokenize(query.q);
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

  const $match = (
    filters.length ? { $match: { $and: filters } } : undefined
  ) as any;

  const pipe: PipelineStage[] = [
    normalizeSkills(),

    {
      $facet: {
        // total global sans filtre
        total: [$match, { $count: "total" }].filter((p) => p),

        // total après filtres
        totalItems: [{ $count: "total" }],

        // data paginée
        data: [
          $match,
          // { $sort: { createdAt: -1 } },
          { $skip: offset },
          { $limit: pageSize },
        ].filter((p) => p),
      },
    },
    {
      $project: {
        items: "$data",

        total: {
          $ifNull: [{ $arrayElemAt: ["$total.total", 0] }, 0],
        },

        totalItems: {
          $ifNull: [{ $arrayElemAt: ["$totalItems.total", 0] }, 0],
        },

        page: { $literal: page },
        pageSize: { $literal: pageSize },

        totalPages: {
          $ceil: {
            $divide: [
              {
                $ifNull: [{ $arrayElemAt: ["$totalItems.total", 0] }, 0],
              },
              pageSize,
            ],
          },
        },
      },
    },
  ];

  let results: IDataResult<JobDocument & { score: number }>;
  [results] = await _Job.aggregate(pipe);

  if (query.q) {
    const tokens = tokenize(query.q);

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
