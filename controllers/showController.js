const showsDatastore = require('../services/showService').default;
const models = require('../models');
const alias = models.alias;

const getAll = async (req, res, next) => {
  res.send(await showsDatastore.findAll())
}


module.exports = {
  getAll
}