import { createCommand } from "commander";
import fs from "fs-extra";
import { get, isEmpty } from "lodash";
import path from "path";
import shell from "shelljs";
import { prepareAction } from "../helpers/prepare-action.helper";
import { validateSchema } from "../helpers/validate-schema.helper";
import { createSchema } from "../validators/create.validatior";
export const create = createCommand("create");

create
  .option("-n --name <name>", "name of application")
  .option("-t --template <template>", "name of template")
  .option("-c --cwd <path>", "Base nx path")
  .action(
    prepareAction(async function (options: any) {
      options = await validateSchema(createSchema, options);

      const currentDir = get(options, "cwd") || shell.pwd().toString();

      const applicationName = get(options, "name");
      let templateSelected = get(options, "template");

      if (isEmpty(templateSelected)) {
        console.log("Choosing default template :ts");
        templateSelected = "ts";
      }
      const nodePlayBase = path.join(__dirname, "..");
      const nodePlayAssets = path.join(nodePlayBase, "assets");
      const selectedAsset = path.join(nodePlayAssets, templateSelected);

      const newPlayPath = path.join(currentDir, applicationName);

      if (fs.existsSync(newPlayPath)) {
        console.log("project path is not empty skipping creation!");
        console.log(newPlayPath);
        return;
      }

      fs.mkdirSync(newPlayPath);

      fs.copySync(selectedAsset, newPlayPath);

      console.log("Project created woha!!!");
    })
  );
