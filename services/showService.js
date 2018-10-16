const Datastore = require('../classes/datastore');
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Jakarta');
const datastore = new Datastore('shows');
const axios = require('axios');
const HALF_HOUR = 1000 * 60 * 30;
const SCRAPER_URL = 'https://us-central1-f4-dev-circle.cloudfunctions.net/jeketiScraper';

const notifySetlistURL = 'https://bot.kyla.life/v1/line/push';

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
    const query = datastore.datastore.createQuery('default').order('unixTime', {
        descending: true
      })
      .limit(1)
    const result = await datastore.datastore.runQuery(query)
    const latest = result[0][0].unixTime;

    const schedules = await axios.get(SCRAPER_URL)
    schedules.data.map(async show => {
      const unixTime = moment(`${show.date} ${show.showTime}`, 'DD.MM.YYYY HH:mm').unix()
      show.unixTime = unixTime;
      if (unixTime > latest) {
        notifySetlistChange(show)
        datastore.insert('default', unixTime, show);
      } else {
        const saveResult = await datastore.insert('default', unixTime, show);
        if (saveResult[0].indexUpdates > 0) {
          notifyMemberChange(show)
        }
      }
    })
  }, HALF_HOUR)
}

const getMembersByShow = (showId) => {
  return datastore.getByKey('default', Number(showId))
}

const encode = (source, data) => {
  return Buffer.from(JSON.stringify({
    source,
    data
  })).toString('base64')
}

const decode = data => {
  return Buffer.from(data, 'base64').toString()
}

const notifyMemberChange = showData => {
  // const datastore = new Datastore()
  // datastore.getByKey(Number(showData.unixTime))
  // .then(result => {
  //   if (result) {
  //     const oldValue = result.members;
  //     const newValue = showData.members;

  //     let replaced = oldValue.filter(x => !newValue.includes(x));
  //     let newMember = (newValue.filter(x => !oldValue.includes(x)));

  //     axios.post()
  //   } else {
  //     datastore.insert('PastPerformer', null, {
  //       previousData: null,
  //       newData: encode(showData.members)
  //     })
  //   }
  // })
}

const notifySetlistChange = showData => {
  axios.post(notifySetlistURL, showData)
}

module.exports = {
  findAll,
  schedule,
  getBySetlist,
  getMembersByShow
}