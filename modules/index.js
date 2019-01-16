const readModels = require('./../db/readModels');

class BaseModule {
  constructor(app, name) {
    this.app = app;
    this.name = name;
  }

  requireModels(dirname) {
    return readModels(dirname, this.name);
  }

  initRouters(app) {
    console.error(`initRouter NOT IMPLEMENTED for \"${this.name}\"`);
  }
}

module.exports = BaseModule;
