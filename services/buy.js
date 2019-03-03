const cheerio = require('cheerio');
const Promise = require('bluebird');
const moment = require('moment');
const SHOWS_PAGE = 'theater/schedule?lang=id';
const parser = require('./parser');
const r = require('request');
const tough = require('tough-cookie');
const Model = require('../models')
moment.tz.setDefault('Asia/Jakarta');
const cookieDB = Model.user_cookie;
const ticket_transactions = Model.ticket_transactions;


const req = r.defaults({
  baseUrl: 'https://jkt48.com/',
  headers: {
    'Host': 'jkt48.com',
    'Connection': 'Keep-Alive',
    'Cache-Control': 'max-age=0',
    'Upgrade-Insecure-Requests': 1,
    'DNT': 1,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/18.17763',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.7,ja;q=0.3',
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  gzip: true,
  followAllRedirects: true,
  rejectUnauthorized: false
})

const get = Promise.promisify(req.get);
const post = Promise.promisify(req.post);


const login = async (cookie) => {
  const kue = cookie.split(';');
  const toughCookieJar = new tough.CookieJar(undefined, {
    looseMode: true
  });
  kue.forEach(cookieValue => {
    toughCookieJar.setCookieSync(cookieValue, 'https://jkt48.com')
  });
  const jar = r.jar();
  jar._jar = toughCookieJar;
  const homepage = (await get('mypage?lang=id', {
    jar
  })).body;
  return jar;
}

const buyTicket = async (date, time, options, jar) => {
  const {
    ticketType
  } = options;

  const resp = (await get(SHOWS_PAGE, {
    jar
  })).body;

  const link = parser.getPurchaseLink(resp, date, time, ticketType);

  if (link) {
    const buyTicketResult = await purchase(link, options, jar);
    return buyTicketResult;
  } else {
    const e = new Error();
    e.type = 'NOT_AVAILABLE';
    e.message = 'TICKET IS NOT OPEN YET';
    throw e;
  }
}

const purchase = async (link, options, jar) => {

  const {
    paymentOption,
    ticketType,
    confirm
  } = options;

  console.log('getting confirmation page')

  const {
    form,
    url
  } = await confirmationPageForm(link, paymentOption, ticketType, jar);

  const confirmBuyForm = await groupBuyForm(url, jar, form);
  console.log('getting final confirmation page');
  const finalPage = await getFinalPage(confirmBuyForm.url, jar, confirmBuyForm.groupForm, confirm);

  return finalPage;
}

const getFinalPage = async (url, jar, form, confirm) => {


  const finalPage = (await post(url, {
    jar,
    form
  })).body;

  const $ = cheerio.load(finalPage);
  const submitHolder = $('.submitHolder').html();


  const purchaseDetails = {};
  const props = [];
  const values = [];

  const $button = cheerio.load(submitHolder);
  const href = $button('a').attr('href');

  const summary = $('.post').html();

  const $summaryTable = cheerio.load(summary);

  $summaryTable('td').each((i, el) => {
    const $el = $(el);
    if (i !== 8 && i !== 9 && i !== 12 && i !== 13 && i !== 18 && i !== 19) {
      if (i === 0 || i % 2 === 0) {
        props.push($el.text().trim())
      } else {
        values.push($el.text().trim())
      }
    }
  })

  for (let i = 0; i < props.length; i++) {
    purchaseDetails[props[i]] = values[i];
  }

  if (href.match('jktpoints')) {
    const errMsg = $button('a').text();
    const e = new Error();
    e.type = 'NOT_ENOUGH_BALANCE';
    e.message = errMsg;
    throw e;
  } else {
    if (confirm) {
      // buy the f in ticket
      const response = await get(href, {
        jar
      })
      if (response.statusCode === 200) {
          return true
      }
    } else {
      return purchaseDetails;
    }
  }
}

const confirmationPageForm = async (link, paymentOption, ticketType, jar) => {
  const resp = (await get(link, {
    jar
  })).body;
  const $ = cheerio.load(resp);
  const url = $('form').attr('action');
  const form = {};
  const payment_methods = [];
  const ticket_types = [];

  $('input').each((i, el) => {
    const $el = $(el);
    form[$el.attr('name')] = $el.val();
  })
  $('#payment_method option').each((i, el) => {
    const $el = $(el);
    if ($el.text().toLowerCase() === paymentOption.toLowerCase()) {
      form.payment_method = $el.val();
    }
    payment_methods.push($el.text())
  })
  $('#attribute option').each((i, el) => {
    const $el = $(el);
    if ($el.text().toLowerCase() === ticketType.toLowerCase()) {
      form.attribute = $el.val();
    }
    ticket_types.push($el.text());
  })

  if (form.attribute && form.agree && form.payment_method) {
    return {
      url,
      form
    }
  } else {
    if (!form.attribute) {
      const e = new Error();
      e.type = 'NEED_TICKET_TYPE';
      e.message = 'NEED TICKET TYPE';
      e.options = ticket_types;
      throw e
    }
    if (!form.payment_method) {
      const e = new Error();
      e.type = 'NEED_PAYMENT_METHOD';
      e.message = 'NEED PAYMENT METHOD';
      e.options = payment_methods;
      throw e
    }
  }
}

const groupBuyForm = async (link, jar, form) => {
  const groupFillPage = (await post(link, {
    jar,
    form
  }));
  const $ = cheerio.load(groupFillPage.body);
  const url = $('form').attr('action');

  const groupForm = {};
  $('input').each((i, el) => {
    const $el = $(el);
    groupForm[$el.attr('name')] = $el.val();
  })
  $('select').each((i, el) => {
    const $el = $(el);
    groupForm[$el.attr('name')] = $el.val();
  })
  groupForm.x = 0;
  groupForm.y = 0;
  delete groupForm['undefined']

  return {
    url,
    groupForm
  }

}

const purchaseTicket = async (lineId, timestamp, options) => {
  try {
    // convert to unix time
    // moment('26.2.2019 19:00', 'DD.M.YYYY HH:mm').unix()

    if (moment.now() > timestamp) {
      const e = new Error();
      e.type = 'NOT_FOUND';
      e.message = 'NO SHOW FOUND';
      throw e;
    }

    const {
      ticketClass
    } = options;

    const {
      cookie,
      email
    } = await cookieDB.findByPk(lineId);

    const ticketClasses = new Set(['GEN', 'VIP', 'OFC']);
    if (ticketClasses.has(ticketClass)) {
      const date = moment(timestamp * 1000).format('DD.M.YYYY');
      const time = moment(timestamp * 1000).format('HH:mm');
      const jar = await login(cookie);
      const buyResult = await buyTicket(date, time, options, jar);
      if (buyResult.result) {
        const saveResult = await ticket_transactions.create({
          id: lineId,
          timestamp,
          ticket_class: options.ticketClass,
          email,
          payment_option: options.paymentOption,
          ticket_type: options.ticketType
        })
        if (saveResult) {
          return {
            success: true
          }
        }
      } else {
        return buyResult;
      }
    } else {
      const e = new Error();
      e.type = 'NEED_TICKET_TYPE';
      e.message = 'TICKET TYPE IS NEEDED OR INVALID';
      throw e;
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
}



module.exports = {
  purchaseTicket
}