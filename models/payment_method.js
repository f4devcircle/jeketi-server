'use strict';
module.exports = (sequelize, DataTypes) => {
  const payment_method = sequelize.define('payment_method', {
    name: DataTypes.STRING,
    processing_fee: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN
  }, {});
  payment_method.associate = function(models) {
    // associations can be defined here
  };
  return payment_method;
};