'use strict';
module.exports = (sequelize, DataTypes) => {
  const ticket_transactions = sequelize.define('ticket_transactions', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    timestamp: DataTypes.INTEGER,
    ticket_class: DataTypes.STRING,
    email: DataTypes.TEXT,
    payment_option: DataTypes.STRING,
    ticket_type: DataTypes.STRING
  }, {});
  ticket_transactions.associate = function(models) {
    // associations can be defined here
  };
  return ticket_transactions;
};