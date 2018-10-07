const showsDatastore = require('../services/showService');
const models = require('../models');
const alias = models.alias;

const getAll = async (req, res, next) => {
  res.send(await showsDatastore.findAll())
}

const getBySetlist = async (req, res, next) => {
  res.send(await showsDatastore.getBySetlist(req.params.setList))
}

const getMembersByShow = async (req, res, next) => {
  res.send(await showsDatastore.getMembersByShow(req.params.showId))
}

module.exports = {
  getAll,
  getBySetlist,
  getMembersByShow
}