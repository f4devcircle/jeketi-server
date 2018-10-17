const Datastore = require('../classes/datastore');
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Jakarta');
const datastore = new Datastore('shows');
const axios = require('axios');
const HALF_HOUR = 1000 * 60 * 30;
const Promise = require('bluebird');
const SCRAPER_URL = 'https://asia-northeast1-f4-dev-circle.cloudfunctions.net/jeketiscraper';

const notifyURL = 'https://indy.ngrok.io/v1/line/push';

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

const notifyMemberChange = async (showData, pastData) => {
  const ds = new Datastore()
  const NOW = moment().unix();
      const oldValue = pastData.members || [];
      const newValue = showData.members;
      let replaced = oldValue.filter(x => !newValue.includes(x));
      let newMember = (newValue.filter(x => !oldValue.includes(x)));
      const showDetail = {...showData}
      showDetail.members = undefined
      Promise.mapSeries(replaced, async member => {
        const result = await ds.queryDatastore('Member', [
          ['name', '=', member]
        ])
        return await axios.post(notifyURL, {
          type: 'member',
          action: 'delete',
          memberId: result[0][datastore.KEY].id,
          showData: showDetail
        })
      })
      Promise.mapSeries(newMember, async member => {
        const result = await ds.queryDatastore('Member', [
          ['name', '=', member]
        ])
        return await axios.post(notifyURL, {
          type: 'member',
          action: 'add',
          memberId: result[0][datastore.KEY].id,
          showData: showDetail
        })
      })

      return await ds.insert('PastPerformer', null, {
        previousData: encode(pastData),
        newData: encode(showData),
        updatedAt: NOW
      })
}

const notifySetlistChange = async showData => {
  const showDetail = {...showData}
  showDetail.members = undefined

  const obj = {
    type: 'setlist',
    showData: showDetail
  }
  return await axios.post(notifyURL, obj)
}

module.exports = {
  findAll,
  schedule,
  getBySetlist,
  getMembersByShow,
  notifySetlistChange,
  notifyMemberChange
}