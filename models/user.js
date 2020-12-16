'use strict';
const { Model } = require('sequelize');
const {check} = require('express-validator');

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

  User.loginRules = function(){
    return [
      check('login', 'Required field').not().isEmpty(),
      check('password', 'Required field').exists(),
    ];
  }

  User.storeRules = function(){
    return [
      check('login', 'Required field').not().isEmpty(),
      check('password','Minimum 6 characters').isLength({min: 6}),
    ];
  }

  return User;
};