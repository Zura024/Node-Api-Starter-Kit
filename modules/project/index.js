const path = require('path');
const BaseModule = require('../index');

class ProjectModule extends BaseModule {
  constructor(app, name) {
    super(app, name);
    this.app = app;
    this.models = this.requireModels(path.join(__dirname, 'models'));
  }

  initRouters() {

    /*
     * Comment one of the following routes to disable respective endpoint
     */

    this.app.use(`/api`, require(`./routes/project`));

    /*
     * Uncomment following code to log registered routes
     */

    // this.app._router.stack.forEach(function(middleware){
    //   if(middleware.route){ // routes registered directly on the app
    //     //console.log(middleware.route.path);
    //   } else if(middleware.name === 'router'){ // router middleware
    //     middleware.handle.stack.forEach(function(handler){
    //       //console.log(handler.route.stack[0].name + " - " + handler.route.path);
    //     });
    //   }
    // });

  }
}

module.exports = ProjectModule;
