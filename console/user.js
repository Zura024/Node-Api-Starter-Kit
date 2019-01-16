const yargs = require('yargs');
const bcrypt = require('bcryptjs');
const sequelize = require('../db/sequelize');
let Sequelize = require('sequelize');
let UserModel = require('./../modules/user/models/User');
let User = UserModel.init(sequelize, Sequelize);

const argv = yargs
  .options({
    'username': {
      demand: true,
      alias: 'u',
      describe: 'Insert new username',
      string: true
    },
    'password': {
      demand: true,
      alias: 'p',
      describe: 'Insert password',
      string: true
    }
  }).help('h').alias('help', 'h').argv;

createUser(argv.username, argv.password);

async function createUser(username, password) {
  // validate
  let user = await User.findOne({
    where: {
      username: username
    }
  });
  if (user) {
    //console.log('Username "' + username + '" is already taken');
    process.exit();
  }
  user = new User({
    username: username,
    hash: bcrypt.hashSync(password, 10)
  });
  user.save().then(success => {
    //console.log('User created successfully');
    process.exit();
  }, error => {
    //console.log(error);
  });
}
