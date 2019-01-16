const fs = require('fs');
let path = require('path');
const readModels = require('./readModels');
let globalModels = path.join(__dirname, '../models');
if (fs.existsSync(globalModels)) {
  readModels(globalModels, 'global');
}
