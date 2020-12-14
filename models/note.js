'use strict';
const { Model } = require('sequelize');
const User = require('./index').User;

module.exports = (sequelize, DataTypes) => {
  class Note extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Note.belongsTo(models.User, { foreignKey: 'id' });
    }
  };
  Note.init({
    text: DataTypes.TEXT,
    userId: DataTypes.BIGINT,
    isPublic: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Note'
  });


  return Note;
};