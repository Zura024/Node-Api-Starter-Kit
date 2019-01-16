let Sequelize = require('sequelize');
const config = require(__dirname + '/../config').db;
config.operatorsAliases = Sequelize.Op;
let sequelize = new Sequelize(config.database, config.username, config.password, config);

module.exports = sequelize;
