const modules = require('./../modules');
const util = require('util');
const path = require('path');
const execSync = require('child_process').execSync;

const script = "node_modules/.bin/sequelize db:migrate --migrations-path ";

for (const folderName of modules.migrationOrdering) {
  const migrationPath = path.join(__dirname, `/../modules/${folderName}/migrations`);
  execSync(script + migrationPath);
}
