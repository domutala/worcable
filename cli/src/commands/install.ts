import { askCoreConfig } from "../prompts/core.prompt";
import { askServices } from "../prompts/services.prompt";
import { askUserInfo } from "../prompts/user.prompt";
import { askVersion } from "../prompts/version.prompt";
import { logger } from "../services/logger.service";
import { Config } from "../types";

export async function installCommand(options: { resetConfig?: boolean }) {
  logger.title("🚀 Worcable installer").log();

  // Version
  const version = "latest"; // await askVersion();

  //  User config
  const userConfig = await askUserInfo({ version });

  // Services
  const services = await askServices();

  let config: Config = {
    user: userConfig,
    version,
    services: { availables: services } as any,
  };

  config = await askCoreConfig(config);
}
