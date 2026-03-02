import mongoose from "mongoose";
import * as _collections from "./collectioons";

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

useMongo();
export const collections = _collections;
