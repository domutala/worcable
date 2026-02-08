import { H3EventContext } from "h3";
import { Session } from "../database/schema";

declare module "h3" {
  interface H3EventContext {
    session: Session;
  }
}
