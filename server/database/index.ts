import { drizzle } from "drizzle-orm/node-postgres";
export { sql, eq, and, or } from "drizzle-orm";
import * as schema from "../database/schema";

export async function up() {
  await db.execute(sql`CREATE EXTENSION IF NOT EXISTS unaccent`);
}

function useDrizzle() {
  const runtime = useRuntimeConfig();
  const db = drizzle({
    connection: {
      connectionString: runtime.databaseUrl,
    },
  });

  up();

  return db;
}

export const tables = schema;
export const db = useDrizzle();
