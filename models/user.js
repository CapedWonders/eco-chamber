'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    bias: DataTypes.INTEGER
  }, {});
  User.associate = function(models) {
    User.belongsToMany(models.Event, {through: 'UserEvent'});
    User.belongsToMany(models.Rating, {through: 'UserRating'});
  };
  return User;
};
