export default defineEventHandler(async (event) => {
  const config = await collections.$Config.findOne();
  return config;
});
