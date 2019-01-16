const path = require('path');
const BaseModule = require('../index');

class UserModule extends BaseModule {
  constructor(app, name) {
    super(app, name);
    this.app = app;
    this.models = this.requireModels(path.join(__dirname, 'models'));
  }

  initRouters() {
    this.app.use(`/api`, require(`./routes/user`));
  }
}

module.exports = UserModule;
