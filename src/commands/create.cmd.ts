import { createCommand } from "commander";
import fs from "fs-extra";
import { Listr } from "listr2";
import { get, isEmpty } from "lodash";
import path from "path";
import shell from "shelljs";
import simpleGit from "simple-git";
import { prepareAction } from "../helpers/prepare-action.helper";
import { validateSchema } from "../helpers/validate-schema.helper";
import { createSchema } from "../validators/create.validatior";
export const create = createCommand("create");

interface Ctx {
  /* some variables for internal use */
  name: string;
  template: string;
  cwd: string;
  open: boolean;
}

create
  .option("-n --name <name>", "name of application")
  .option("-t --template <template>", "name of template")
  .option("-c --cwd <path>", "Base nx path")
  .option("-o --open", "Open in VS Code")
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

      const tasks = new Listr<Ctx>(
        [
          {
            title: "Creating folder",
            task(ctx, task) {
              if (fs.existsSync(newPlayPath)) {
                throw new Error("project path is not empty skipping creation!");
              }

              fs.mkdirSync(newPlayPath);
            },
          },
          {
            title: "Copying assets",
            task(ctx, task) {
              fs.copySync(selectedAsset, newPlayPath);

              fs.renameSync(
                path.join(newPlayPath, "git-ignore"),
                path.join(newPlayPath, ".gitignore")
              );
            },
          },
          {
            title: "Initializing Git",
            task(ctx, task) {
              const git = simpleGit(newPlayPath);

              git.init();
              git.add("./*");
              git.commit("chore(stack): created base project");

              git.checkoutLocalBranch("main");
              git.deleteLocalBranch("master");
            },
          },
          {
            title: "Installing dependencies",
            task(ctx, task) {
              shell.exec("npm i", {
                cwd: newPlayPath,
                silent: true,
              });
            },
          },
          {
            title: "Open In Code",
            task(ctx, task) {
              if (ctx.open) {
                shell.exec("code .", {
                  cwd: newPlayPath,
                  silent: true,
                });
              } else {
                task.skip();
              }
            },
          },
        ],
        {
          concurrent: false,
        }
      );

      await tasks.run(options);

      console.log("Project created woha!!!");
    })
  );
