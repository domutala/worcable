import { listJobs } from "~~/server/services/job_list";

export default defineEventHandler(async (event) => {
  const $t = await useTranslation(event);
  const query = getQuery(event);

  /** limiter les offres renvoyé au offres ouvertes */
  let { filterBy } = query as { filterBy: string };
  filterBy ||= "";

  const newFilters = [];
  const filters = filterBy.split(";");
  for (const filter of filters) {
    const [key] = filter.split(":");
    if (key !== "status") newFilters.push(filter);
  }

  newFilters.push("status:open");
  query.filterBy = newFilters.join(";");
  /** ******* */

  return await listJobs({ $t, query });
});
