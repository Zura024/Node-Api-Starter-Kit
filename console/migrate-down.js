const modules = require('./../modules');
const util = require('util');
const path = require('path');
const execSync = require('child_process').execSync;

const script = "node_modules/.bin/sequelize db:migrate:undo:all --migrations-path";

const reversedFolderNames = modules.migrationOrdering.reverse();

for (const folderName of reversedFolderNames) {
  const migrationPath = path.join(__dirname, `/../modules/${folderName}/migrations`);
  execSync(script + migrationPath);
}
