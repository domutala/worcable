import type { CoreConfig } from "../prompts/core.prompt";

export type ServiceName = "core" | "db" | "mailer" | "cvparser";

export interface UserConfig {
  name: string;
  email: string;
  orgName: string;

  baseUrl: string;
  protocole: string;

  deployMethod: "docker" | "native";

  configDir: string;
  configPath: string;
}

export type Config = {
  user: UserConfig;
  version: string;
  services: { availables: ServiceName[]; core: CoreConfig };
};
