import { H3EventContext } from "h3";
import { Session, User } from "../database/collections";

import { Schema, Types } from "mongoose";
import { ServiceTier } from "./service_tier";

declare module "h3" {
  interface H3EventContext {
    session: Session & { user: User; service: ServiceTier };
  }
}

declare module "mongoose" {
  namespace Schema {
    namespace Types {
      class ZodType extends SchemaType {
        /** This schema type's name, to defend against minifiers that mangle function names. */
        static readonly schemaName: "ZodType";
      }
    }
  }
}
