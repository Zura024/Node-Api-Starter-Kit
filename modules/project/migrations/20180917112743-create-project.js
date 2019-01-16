'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('project', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(255)
      },
      folder_name: {
        type: Sequelize.STRING(64)
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
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('project');
  }
};
