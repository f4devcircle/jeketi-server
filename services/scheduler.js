const axios = require('axios');
const HALF_HOUR = 1000 * 60 * 30;
const SCRAPER_URL = 'https://asia-northeast1-f4-dev-circle.cloudfunctions.net/jeketiscraper';
const moment = require('moment');

class Scheduler {
  constructor() {

    setInterval(() => {
      this.getNewData()
    }, HALF_HOUR)
  }

  async getNewData() {
    const schedule = await axios.get(SCRAPER_URL)
    schedule.data.map(show => {
      const unixTime = moment(`${show.date} ${show.showTime}`, 'DD.MM.YYYY HH:mm').unix()
      show.unixTime = unixTime;
    })
  }
}