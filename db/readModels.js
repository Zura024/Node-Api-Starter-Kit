let fs = require('fs');
let path = require('path');
const models = require('./models');
let Sequelize = require('sequelize');
let sequelize = require('./sequelize');

module.exports = function(dirname, moduleKey){

  models[moduleKey] = {};

  fs
    .readdirSync(dirname)
    .filter(file => {
      return (file.indexOf('.') !== 0) && file !== 'index.js' && (file.slice(-3) === '.js');
    })
    .forEach(file => {
      let modelName = file.split('.').slice(0, -1).join('.');
      let modelClass = require(path.join(dirname,  file));
      models[moduleKey][modelName] = modelClass.init(sequelize, Sequelize);
    });

  Object.values(models[moduleKey])
    .filter(model => typeof model.associate === "function")
    .forEach(model => model.associate(models));

  return models[moduleKey];
};
