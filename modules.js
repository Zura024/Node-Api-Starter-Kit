const UserModule = require('./modules/user');
const ProjectModule = require('./modules/project');

module.exports = {
  modules: {},
  migrationOrdering: [
    'user',
  ],
  // Initializing modules
  // Uncomment any module in modules object to turn off the respective module
  init: function (app) {
    this.modules = {
      user: UserModule,
      project: ProjectModule,
    };
    for (let key in this.modules) {
      this.modules[key] = new this.modules[key](app, key);
    }
    return this.modules;
  },
  // Initializing routers
  initRouters: function () {
    for (const i in this.modules) {
      this.modules[i].initRouters();
    }
  }
};
