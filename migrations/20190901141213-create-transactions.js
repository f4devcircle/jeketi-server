'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      trx_id: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      payment_method_id: {
        type: Sequelize.INTEGER
      },
      payment_account_id: {
        type: Sequelize.INTEGER
      },
      receiving_account_id: {
        type: Sequelize.INTEGER
      },
      lineId: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.INTEGER
      },
      subtotal: {
        type: Sequelize.INTEGER
      },
      admin_fee: {
        type: Sequelize.INTEGER
      },
      total: {
        type: Sequelize.INTEGER
      },
      processing_fee: {
        type: Sequelize.INTEGER
      },
      unique_code: {
        type: Sequelize.INTEGER
      },
      grand_total: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.ENUM({
          'values': ['WAITING_FOR_PAYMENT', 'PAYMENT_RECEIVED', 'COMPLETED', 'EXPIRED']
        })
      },
      expiredAt: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('transactions');
  }
};