'use strict';
const { Model } = require('sequelize');
const Note = require('./index').Note;

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Note, { foreignKey: 'userId' });
    }
  }
  User.init({
    login: DataTypes.STRING,
    password: DataTypes.STRING,
    sessionsTerminatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};