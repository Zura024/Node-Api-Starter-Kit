'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user', {
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
        type: Sequelize.STRING(255),
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
        references: {model: 'user', key: 'id'}
      },
      updated_by: {
        type: Sequelize.INTEGER,
        references: {model: 'user', key: 'id'}
      },
      deleted_by: {
        type: Sequelize.INTEGER,
        references: {model: 'user', key: 'id'}
      },
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('user');
  }
};
