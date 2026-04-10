import * as compose from "docker-compose";
import type { Service } from "docker-compose/dist/compose-spec";
import type { Config } from "../../types";

export async function runDocker(config: Config) {
  const tag = config.version.replaceAll(".", "");
  const branchName = `worcable-${tag}`;
  const domain = config.services.core.appUrl.replace(/^https?:\/\//, "");
  const networName = "proxy";

  const coreService: Service = {
    image: `domutala/worcable-core:${config.version}`,
    container_name: branchName,
    restart: "always",
    env_file: ".env",
    environment: { NODE_ENV: "production" },
    logging: {
      driver: "json-file",
      options: {
        "max-size": "10m",
        "max-file": "3",
      },
    },
  };

  const labels: string[] = [];

  labels.push(
    "traefik.enable=true",
    `traefik.http.routers.worcable-${branchName}.rule=Host('${domain}')`,
    `traefik.http.routers.worcable-${branchName}.entrypoints=web,websecure`,
    `traefik.http.routers.worcable-${branchName}.tls.certresolver=myresolver`,
    `traefik.http.services.worcable-${branchName}.loadbalancer.server.port=3000`,
    `traefik.http.routers.worcable-${branchName}-http.rule=Host('${domain}')`,
    `traefik.http.routers.worcable-${branchName}-http.entrypoints=web`,
    `traefik.http.routers.worcable-${branchName}-http.middlewares=redirect-to-http`,
    `traefik.http.middlewares.redirect-to-https.redirectscheme.scheme=https`
  );

  coreService.labels = labels;

  coreService.networks = [networName];

  const r = await compose.upAll({
    log: true,
    cwd: config.services.core.baseDir,
    compose: {
      services: { core: coreService },
      networks: {
        [networName]: { external: true },
      },
    },
  });

  return r;
}
