import { Config } from "../../types";
import { runDocker } from "./docker.service";

export async function runCore(config: Config) {
  if (config.user.deployMethod === "docker") {
    await runDocker(config);
  } else if (config.user.deployMethod === "native") {
  }
}
