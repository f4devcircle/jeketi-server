const Datastore = require('../classes/datastore');
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Jakarta');
const datastore = new Datastore();
const axios = require('axios');
const FIVE_MINUTES = 1000 * 60 * 5;
const Promise = require('bluebird');
const SCRAPER_URL = 'https://asia-northeast1-f4-dev-circle.cloudfunctions.net/jeketiscraper';

const notifyURL = 'https://bot.kyla.life/v1/line/push';

const findAll = () => {
  const NOW = moment().unix();
  return datastore.queryDatastore('Show', [
    ['unixTime', '>', NOW]
  ])
}

const getByMember = async (memberName) => {
  const shows = await datastore.queryDatastore('Show', [
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
  return datastore.queryDatastore('Show', [
    ['unixTime', '>', NOW],
    ['showName', '=', setlistName]
  ])
}

const schedule = async () => {
  try {
    setInterval(async () => {
      console.log(moment().format('DD-MM-YYYY HH-mm-ss'))
      const query = datastore.datastore.createQuery('Show').order('unixTime', {
          descending: true
        })
        .limit(1)
      const result = await datastore.datastore.runQuery(query)
      const latest = result[0][0].unixTime;

      const schedules = await axios.get(SCRAPER_URL)
      schedules.data.map(async show => {
        const unixTime = moment(`${show.date} ${show.showTime}`, 'DD.MM.YYYY HH:mm').unix()
        show.unixTime = unixTime;
        show.members ? show.members : show.members = null
        if (unixTime > latest) {
          notifySetlistChange(show)
          datastore.insert('Show', unixTime, show);
        } else {
          const pastData = await datastore.getByKey('Show', unixTime)
          const saveResult = await datastore.insert('Show', unixTime, show);
          if (saveResult[0].indexUpdates > 0) {
            notifyMemberChange(show, pastData)
          }
        }
      })
    }, FIVE_MINUTES)
  } catch (e) {
    console.error(e)
  }
}

const getMembersByShow = (showId) => {
  return datastore.getByKey('Show', Number(showId))
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
        const data = {
          type: 'member',
          action: 'delete',
          memberId: result[0][datastore.KEY].id,
          showData: showDetail
        }
        console.log("updating data")
        console.log(data)
        return await axios.post(notifyURL, data)
      })
      Promise.mapSeries(newMember, async member => {
        const result = await ds.queryDatastore('Member', [
          ['name', '=', member]
        ])
        const data = {
          type: 'member',
          action: 'add',
          memberId: result[0][datastore.KEY].id,
          showData: showDetail
        }
        console.log("updating data")
        console.log(data)
        return await axios.post(notifyURL, data)
      })

      return await ds.insert('PastPerformer', null, {
        previousData: pastData,
        newData: showData,
        updatedAt: NOW,
      })
}

const notifySetlistChange = async showData => {
  const showDetail = {...showData}
  showDetail.members = undefined

  const obj = {
    type: 'setlist',
    showData: showDetail
  }
  console.log('updating setlist')
  console.log(obj)
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