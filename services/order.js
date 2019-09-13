const {
  transactions: transaction,
  payment_method: paymentMethod,
  receiving_account: receivingAccount
} = require('../models');
const {
  notIn,
  and,
  lt,
} = require('sequelize')['Op'];
const id = require('shortid');
const MAXIMUM_UNIQUE_PRICE = 200;
const MINIMUM_UNIQUE_PRICE = 100;
const ONE_MINUTE = 60 * 1000;
const MAXIMUM_RETRY = 100;
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Jakarta');
const REUSED_CONDITION = ['EXPIRED', 'COMPLETED'];

const cleanFunction = async () => {
  const NOW = moment().format('YYYY-MM-DD HH:mm:ss');
  const formattedTime = moment.tz(NOW, 'Asia/Jakarta').format();
  transaction.update({
    status: 'EXPIRED'
  }, {
    where: {
      [and] : [{
        expiredAt: {
          [lt]: formattedTime
        }
      }, {
        status: {
          [notIn]: REUSED_CONDITION
        }
      }]
    }
  })
}

const createOrder = async options => {
  if (!options) {
    throw new Error('param cannot be empty');
  } else {
    if (!options.amount) {
      return {
        amounts: await getAvailableAmounts()
      }
    }
    if (!options.paymentMethod) {
      return {
        paymentMethods: await getPaymentMethods()
      }
    }
    if (options.confirm) {
      // TODO: if confirmed, fill the payment account id num
    }
    const quotation = await getQuotation(options);
    return quotation;
  }
}

const getQuotation = async options => {
  const {
    paymentMethod: name,
    lineId,
    email,
    amount
  } = options;

  const paymentAccounts = await receivingAccount.findAll({
    include: [{
      model: paymentMethod,
      where: {
        [and]: [{
          name
        }, {
          status: true
        }]
      }
    }]
  });

  const paymentAccountIndex = Math.floor(Math.random() * paymentAccounts.length);
  const receivingPaymentAccount = paymentAccounts[paymentAccountIndex];


  const detailPayment = await getPaymentDetail(amount, receivingPaymentAccount.payment_method.processing_fee);
  const status = 'WAITING_FOR_PAYMENT';
  const trx_id = await getUniqueTransactionId();

  const quotation = await transaction.findOne({
    where: {
      [and]: [{
          trx_id
        },
        {
          status: {
            [notIn]: REUSED_CONDITION
          }
        }
      ]
    }
  });

  const {
    subtotal,
    admin_fee,
    total,
    unique_code,
    grand_total,
    processing_fee
  } = detailPayment;

  const expiredAt = moment().add(2, 'minute').format('YYYY-MM-DD HH:mm:ss');
  const formattedTime = moment.tz(expiredAt, 'Asia/Jakarta').format();

  const updatedData = await quotation.update({
    payment_method_id: receivingPaymentAccount.payment_method.id,
    payment_account_id: null,
    receiving_account_id: receivingPaymentAccount.id,
    lineId,
    email,
    subtotal, // jumlah yang dibeli
    admin_fee, // MDR
    total, // total dari website jeketi
    processing_fee, // processing fee
    unique_code, // unique code
    grand_total, // total semua
    status,
    expiredAt: formattedTime
  })

  console.log("==============")
  console.log(updatedData)
  console.log("==============")
  // return quotation;
}

const getAvailableAmounts = async _ => {

}

const getPaymentDetail = async (amount, processing_fee, attempt = 0) => {
  if (attempt === MAXIMUM_RETRY) {
    throw new Error(`Error while getting payment detail after 100 times`)
  }
  const subtotal = amount;
  const admin_fee = 999 //getAdminFee(amount);
  const total = subtotal + admin_fee;
  const unique_code = Math.floor(Math.random() * (MAXIMUM_UNIQUE_PRICE - MINIMUM_UNIQUE_PRICE + 1)) + MINIMUM_UNIQUE_PRICE;
  const grand_total = total + processing_fee + unique_code;
  const duplicate = await transaction.findOne({
    where: {
      [and]: [{
          grand_total
        },
        {
          status: {
            [notIn]: REUSED_CONDITION
          }
        }
      ]
    }
  })
  if (duplicate) {
    getPaymentDetail(amount, processing_fee)
  } else {
    return {
      subtotal,
      admin_fee,
      total,
      unique_code,
      grand_total,
      processing_fee
    };
  }
}

const getUniqueTransactionId = async (attempt = 0) => {
  if (attempt === MAXIMUM_RETRY) {
    throw new Error(`Error while getting unique transaction id after 100 times`)
  }
  const trx_id = id.generate();
  const duplicate = await transaction.findOne({
    where: {
      [and]: [{
          trx_id
        },
        {
          status: {
            [notIn]: REUSED_CONDITION
          }
        }
      ]
    }
  });

  if (duplicate) {
    return getUniqueTransactionId(attempt + 1);
  } else {
    const result = await transaction.create({
      trx_id,
      status: 'CREATED'
    });
    return result.trx_id;
  }
}

const sleep = timeout => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return resolve()
    }, timeout)
  })
}

const cleaner = setInterval(cleanFunction, ONE_MINUTE);

// immediately invoke cleanFunction
(cleanFunction)()

// TODO: ALLOW REUSE COMPLETED TRX ID
// TODO: ADD TRANSACTION

module.exports = {
  createOrder
}