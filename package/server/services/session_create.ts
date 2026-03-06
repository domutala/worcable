import { User, UserDocument } from "../database/collections";
import jwt from "jsonwebtoken";
import _ from "lodash";
import { string } from "zod";

export async function createSeassion(
  user: UserDocument,
): Promise<{ token: string; user: User }> {
  const runtime = useRuntimeConfig();
  const session = await collections.$Session.create({
    userID: user._id.toString(),
  });

  _.unset(user, "password");

  const token = jwt.sign({ sessionID: session.id }, runtime.secretKey);
  return { token, user: user as any as User };
}
