import { drizzle } from "drizzle-orm/node-postgres";
export { sql, eq, and, or } from "drizzle-orm";
import * as schema from "../database/schema";

function useDrizzle() {
  const runtime = useRuntimeConfig();
  const db = drizzle({ connection: { connectionString: runtime.databaseUrl } });

  return db;
}

export const tables = schema;
export const db = useDrizzle();
