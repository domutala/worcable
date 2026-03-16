import { checkJobUserRole } from "~~/server/services/job/get";
import { listUsers } from "~~/server/services/user_list";

export default defineEventHandler(async (event) => {
  const $t = await useTranslation(event);
  const id = getRouterParam(event, "id") as string;
  const query = getQuery(event);

  await checkJobUserRole({
    $t,
    userID: event.context.session.user.id,
    jobID: id,
    role: ["admin", "recruiter", "guest"],
  });

  const ids = await collections.$JobUser.distinct("userID", { jobID: id });
  const users = await listUsers({ $t, query: { ...query, ids } });
  const jobUsers = await collections.$JobUser.find({
    userID: { $in: users.items.map((u) => u._id) },
    jobID: id,
  });

  const items = users.items.map((user) => {
    const jobUser = jobUsers.find(
      (ju) => ju.userID.toString() === user._id.toString(),
    );
    return { ...user, jobUser: jobUser };
  });

  return { ...users, items };
});
