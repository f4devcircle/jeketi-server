const Datastore = require('../classes/datastore');
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Jakarta');
const datastore = new Datastore();
const axios = require('axios');
const FIVE_MINUTES = 1000 * 60 * 5;
const Promise = require('bluebird');
const SCRAPER_URL = 'https://asia-northeast1-f4-dev-circle.cloudfunctions.net/jeketiscraper';
const redis = require('redis')
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

const client = redis.createClient({
  host: '192.168.0.2'
});

client.on("error", function (err) {
  console.log("Error " + err);
});

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

const getBySetlist = async setlistName => {
  const NOW = moment().unix();
  try {
    let schedules = await getData('Show')
    let result = []
    if (schedules) {
      schedules = JSON.parse(schedules)
      schedules.data.map(schedule => {
        if (schedule.unixTime > NOW && schedule.showName === setlistName) {
          result.push(schedule)
        }
      })
      return result
    } else {
      return datastore.queryDatastore('Show', [
        ['unixTime', '>', NOW],
        ['showName', '=', setlistName]
      ])
    }
  } catch (e) {
    console.error(e)
  }
}

const schedule = async () => {
  try {
    setInterval(async () => {
      console.log(moment().format('DD-MM-YYYY HH-mm-ss'))
      const query = datastore.datastore.createQuery('Show').order('unixTime', { descending: true }).limit(1)
      const result = await datastore.datastore.runQuery(query)
      const latest = result[0][0].unixTime;
      let changed = false
      const schedules = await axios.get(SCRAPER_URL)
      await schedules.data.map(async show => {
        show.members ? show.members : show.members = null
        if (show.unixTime > latest) {
          changed = true
          notifySetlistChange(show)
          datastore.insert('Show', null, show);
        } else {
          const pastData = await datastore.queryDatastore('Show', [ [ 'unixTime', '=', show.unixTime] ])
          const saveResult = await datastore.insert('Show', null, show);
          if (saveResult[0].indexUpdates > 0) {
            changed = true
            notifyMemberChange(show, pastData[0])
          }
        }
      })

      if (changed) {
        setData('Show', {data: schedules.data})
      }
    }, FIVE_MINUTES)
  } catch (e) {
    console.error(e)
  }
}

const getMembersByShow = async (showId) => {
  const result = await datastore.queryDatastore('Show', [
    ['unixTime', '=', showId]
  ])
  return result[0]
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
      await Promise.mapSeries(replaced, async member => {
        const result = await ds.queryDatastore('Member', [
          ['name', '=', member]
        ])
        const data = {
          type: 'member',
          action: 'delete',
          memberId: result[0][datastore.KEY].id,
          showData: showDetail
        }
        console.log("updating member deletion data")
        console.log(data)
        return await axios.post(notifyURL, data)
      })
      await Promise.mapSeries(newMember, async member => {
        const result = await ds.queryDatastore('Member', [
          ['name', '=', member]
        ])
        const data = {
          type: 'member',
          action: 'add',
          memberId: result[0][datastore.KEY].id,
          showData: showDetail
        }
        console.log("updating member add data")
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


const getData = async key => {
  return await client.getAsync(key)
}

const setData = async (key, value, timeout) => {
  if (timeout) {
    return await client.setexAsync(key, timeout, JSON.stringify(value))
  } else {
    return await client.setAsync(key, JSON.stringify(value))
  }
}


module.exports = {
  findAll,
  schedule,
  getBySetlist,
  getMembersByShow,
  notifySetlistChange,
  notifyMemberChange
}