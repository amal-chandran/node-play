import { program } from "commander";
import { create } from "./commands/create.cmd";

program.version("0.0.1");

program.addCommand(create);

program.parse(process.argv);
