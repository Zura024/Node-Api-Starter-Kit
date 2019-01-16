const Sequelize = require('sequelize');
const Op = Sequelize.Op;


class User extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(this.getAttributes(sequelize, DataTypes), this.getOptions(sequelize));
  }

  static associate(models) {

  }

  static getAttributes(sequelize, Sequelize) {
    return {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      hash: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type:
        Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type:
        Sequelize.DATE
      },
      deleted_at: {
        type: Sequelize.DATE
      },
      created_by: {
        type: Sequelize.INTEGER,
      },
      updated_by: {
        type: Sequelize.INTEGER,
      },
      deleted_by: {
        type: Sequelize.INTEGER,
      },
    }
  }

  getJson() {
    let user = Object.assign({}, this.dataValues);
    delete user.hash;
    return user;
  }

  static getOptions(sequelize) {
    return {
      tableName: 'user',
      sequelize
    }
  }


}

module.exports = User;
