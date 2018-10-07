const Datastore = require('../classes/datastore');
const moment = require('moment');
moment.locale('ID');
const datastore = new Datastore('shows');
const axios = require('axios');
const HALF_HOUR = 1000 * 60 * 30;
const SCRAPER_URL = 'https://asia-northeast1-f4-dev-circle.cloudfunctions.net/jeketiscraper';

const findAll = () => {
  const NOW = moment().unix();
  return datastore.queryDatastore('default', [
    ['unixTime', '>', NOW]
  ])
}

const getByMember = async (memberName) => {
  const shows = await datastore.queryDatastore('default', [
    ['unixTime', '>', NOW]
  ])
  const result = []
  shows.map(show => {
    if (show.members.indexOf(memberName) > -1) {
      result.push(show)
    }
  });

  return result
}

const getBySetlist = (setlistName) => {
  const NOW = moment().unix();
  return datastore.queryDatastore('default', [
    ['unixTime', '>', NOW],
    ['showName', '=', setlistName]
  ])
}

const schedule = async () => {
  setInterval(async () => {
    const schedules = await axios.get(SCRAPER_URL)
    schedules.data.map(show => {
      const unixTime = moment(`${show.date} ${show.showTime}`, 'DD.MM.YYYY HH:mm').unix()
      show.unixTime = unixTime;
      datastore.insert('default', unixTime, show);
    })
  }, HALF_HOUR)
}

const getMembersByShow = (showId) => {
  return datastore.getByKey('default', Number(showId))
}

module.exports = {
  findAll,
  schedule,
  getBySetlist,
  getMembersByShow
}