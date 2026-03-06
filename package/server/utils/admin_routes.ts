import type { USER_ROLE } from "~~/server/services/user_shema";
import { HTTPMethod } from "h3";

type RouteRule = {
  pattern: string | RegExp;
  methods: HTTPMethod[];
  roles: (typeof USER_ROLE)[number][];
};

export const routeRules: RouteRule[] = [
  { pattern: "/api/admin/job", methods: ["POST"], roles: ["admin"] },

  {
    pattern: /^\/api\/admin\/apply\/[^/]+\/note$/,
    methods: ["POST"],
    roles: ["admin", "recruiter"],
  },

  {
    pattern: /^\/api\/admin\/apply\/[^/]+\/status$/,
    methods: ["POST"],
    roles: ["admin", "recruiter"],
  },
];
