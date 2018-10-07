'use strict';
module.exports = (sequelize, DataTypes) => {
  const alias = sequelize.define('alias', {
    call_name: DataTypes.STRING,
    real_name: DataTypes.STRING
  }, {});
  alias.associate = function(models) {
    // associations can be defined here
  };
  return alias;
};