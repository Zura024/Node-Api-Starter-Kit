const Sequelize = require('sequelize');
const session = require('./../../../helpers/sessionHelper');
const Op = Sequelize.Op;

class Project extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(this.getAttributes(sequelize, DataTypes), this.getOptions(sequelize));
  }

  static associate(models) {
    this.project = this.belongsTo(models.user.User, {
      foreignKey: 'created_by',
      as: 'createdBy'
    });
  }

  static getAttributes(sequelize, Sequelize) {
    return {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      folder_name: {
        type: Sequelize.STRING
      },
      stable_domain_id: {
        type: Sequelize.INTEGER,
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

  static getOptions(sequelize) {
    return {
      tableName: 'project',
      scopes: {
        notDeleted: {
          where: {
            deleted_at: null
          }
        }
      },
      hooks: {
        beforeCreate: (project, options) => {
          project.created_by = session().getUser().id;
          project.updated_by = session().getUser().id;
        },
        beforeUpdate: (project, options) => {
          project.updated_by = session().getUser().id;
        }
      },
      sequelize
    }
  }

  static createProject(params) {
    return this.create(params);
  }

  getJson() {
    return Object.assign({}, this.dataValues);
  }


  markDeleted() {
    this.deleted_at = new Date();
    this.deleted_by = session().getUser().id;
    return this.save()
  }


}

module.exports = Project;
