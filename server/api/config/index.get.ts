export default defineEventHandler(async (event) => {
  let [config] = await db.select().from(tables.config);
  if (!config) return await db.insert(tables.config).values({}).returning();

  return config;
});
