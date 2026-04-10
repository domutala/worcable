import { cac } from "cac";
import { installCommand } from "./commands/install";

const cli = cac("worcable");

cli
  .command("install", "Install Worcable")
  .option("--reset-config", "Reset config")
  .action(installCommand);

cli.help();
cli.parse();
