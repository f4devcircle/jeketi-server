const Datastore = require('../classes/datastore');
const moment = require('moment');
moment.locale('ID');
const datastore = new Datastore('shows');
const axios = require('axios');
const HALF_HOUR = 1000 * 60 * 30;
const SCRAPER_URL = 'https://asia-northeast1-f4-dev-circle.cloudfunctions.net/jeketiscraper';

const findAll = () => {
  const NOW = moment().unix();
  return datastore.queryDatastore(['unixTime', '>', NOW])
}

const schedule = async () => {
  const schedules = await axios.get(SCRAPER_URL)
  schedules.data.map(show => {
    const unixTime = moment(`${show.date} ${show.showTime}`, 'DD.MM.YYYY HH:mm').unix()
    show.unixTime = unixTime;
    datastore.insert(unixTime, show);
  })
  
  setInterval(async () => {
    const schedules = await axios.get(SCRAPER_URL)
    schedules.data.map(show => {
      const unixTime = moment(`${show.date} ${show.showTime}`, 'DD.MM.YYYY HH:mm').unix()
      show.unixTime = unixTime;
      datastore.insert(unixTime, show);
    })
  }, HALF_HOUR)
}

module.exports = {
  findAll,
  schedule
}