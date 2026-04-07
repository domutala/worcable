import { USER_ROLES } from "~~/server/services/user_shema";
import { HTTPMethod } from "h3";

const roles = [...USER_ROLES, "service"] as const;
export type RouteRuleRole = (typeof roles)[number];

type RouteRule = {
  pattern: string | RegExp;
  methods: HTTPMethod[];
  roles: RouteRuleRole[];
};

export const routeRules: RouteRule[] = [
  { pattern: "/api/admin/job", methods: ["POST"], roles: ["admin", "service"] },

  { pattern: "/api/admin/user/invite", methods: ["POST"], roles: ["admin"] },
  {
    pattern: /^\/api\/admin\/user\/[^/]+\/role$/,
    methods: ["POST"],
    roles: ["admin"],
  },
  {
    pattern: /^\/api\/admin\/user\/[^/]$/,
    methods: ["DELETE"],
    roles: ["admin"],
  },

  // {
  //   pattern: /^\/api\/admin\/apply\/[^/]+\/note$/,
  //   methods: ["POST"],
  //   roles: ["admin", "recruiter"],
  // },

  // {
  //   pattern: /^\/api\/admin\/apply\/[^/]+\/status$/,
  //   methods: ["POST"],
  //   roles: ["admin", "recruiter"],
  // },
];
