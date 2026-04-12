export default defineEventHandler(async (event) => {
  let config = await collections.$Config.findOne();

  if (!config) {
    config = await collections.$Config.create({ name: "Orgs'name" });
  }

  return config;
});
