/* eslint-disable no-console */
const execa = require("execa");
const fs = require("fs");

(async () => {
  try {
    await execa("git", ["checkout", "--orphan", "gh-pages-deploy-tmp"]);
    console.log("Building started...");
    const legacyFlag = "--openssl-legacy-provider";
    const existingNodeOptions = process.env.NODE_OPTIONS || "";
    const nodeOptions = existingNodeOptions.includes(legacyFlag)
      ? existingNodeOptions
      : `${existingNodeOptions} ${legacyFlag}`.trim();
    await execa("npm", ["run", "build"], {
      env: { ...process.env, NODE_OPTIONS: nodeOptions },
    });

    const folderName = fs.existsSync("dist") ? "dist" : "build";
    await execa("git", ["--work-tree", folderName, "add", "--all"]);
    await execa("git", ["--work-tree", folderName, "commit", "-m", "gh-pages"]);

    console.log("Pushing to gh-pages...");
    await execa("git", ["push", "origin", "HEAD:gh-pages", "--force"]);
    await execa("rm", ["-r", folderName]);
    await execa("git", ["checkout", "-f", "main"]);
    await execa("git", ["branch", "-D", "gh-pages-deploy-tmp"]);
    console.log("Successfully deployed, check your settings");
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
})();
