import { H3EventContext } from "h3";
import { Session, User } from "../mongoose/collectioons";

declare module "h3" {
  interface H3EventContext {
    session: Session & { user: User };
  }
}
