const config = require('../../../config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const modulesObject = require('./../../../modules');

module.exports = {
  authenticate,
  getAll,
  getById,
};

let User = modulesObject.modules.user.models.User;

async function authenticate({username, password}) {
  const user = await User.findOne({
    where: {
      username: username
    }
  });
  if (user && bcrypt.compareSync(password, user.hash)) {

    const token = jwt.sign({
      sub: user.id
    }, config.secret);

    return {
      username: user.username,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
      id: user.id,
      token
    };
  }
}

async function getAll() {
  return await User.findAll({
    attributes: [
      'username',
      'id',
      'name',
      'email',
      'created_at',
      'updated_at',
    ]
  });
}

async function getById(id) {
  return await User.findById(id, {
    attributes: [
      'username',
      'id',
      'name',
      'email',
      'created_at',
      'updated_at',
    ]
  });
}
