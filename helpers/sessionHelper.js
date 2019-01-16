module.exports = function () {
  let session = require('continuation-local-storage').getNamespace('projectName');

  return {
    getUser: function () {
      return session.get('user')
    }
  }
};
