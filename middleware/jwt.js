const expressJwt = require('express-jwt');
const config = require('../config');
const userService = require('../modules/user/services/user-service');

function jwt() {
  const secret = config.secret;
  return expressJwt({secret, isRevoked}).unless({
    path: [
      // public routes that don't require authentication
      '/api/users/authenticate'
    ]
  });
}

async function isRevoked(req, payload, done) {
  const user = await userService.getById(payload.sub);

  // revoke token if user no longer exists
  if (!user) {
    return done(null, true);
  }

  const session = require('continuation-local-storage').createNamespace('projectName');
  session.active = {};
  session.set('user', user);

  done();
}

module.exports = jwt;
