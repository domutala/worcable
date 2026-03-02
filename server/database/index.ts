import mongoose from "mongoose";
import * as _collections from "./collections";

let connectionPromise: Promise<typeof mongoose> | null = null;

export async function useMongo() {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (!connectionPromise) {
    const runtime = useRuntimeConfig();
    const uri = runtime.mongoUri;

    if (!uri) {
      throw new Error("Mongo URI missing");
    }

    connectionPromise = mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30_000, // 5000,
      socketTimeoutMS: 45000,
    });
  }

  return connectionPromise;
}

export function getFacet(offset: number, pageSize: number, all?: boolean) {
  const facet: mongoose.PipelineStage.Facet = {
    $facet: {
      totalItems: [{ $count: "count" }],
      data: [
        { $sort: { createdAt: -1 } },
        ...(all ? [] : [{ $skip: offset }, { $limit: pageSize }]),
      ],
    },
  };

  return facet;
}

export function getProject(
  page: number,
  pageSize: number,
): mongoose.PipelineStage {
  return {
    $project: {
      items: "$data",
      totalItems: {
        $ifNull: [{ $arrayElemAt: ["$totalItems.count", 0] }, 0],
      },
      total: { $size: "$data" },
      page: { $literal: page },
      pageSize: { $literal: pageSize },
      totalPages: {
        $ceil: {
          $divide: [
            { $ifNull: [{ $arrayElemAt: ["$totalItems.count", 0] }, 0] },
            pageSize,
          ],
        },
      },
    },
  };
}

export const collections = _collections;

useMongo();
