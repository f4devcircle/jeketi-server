const express = require('express');
const bodyParser = require('body-parser');
const shows = require('./routes/shows.route')
const scrapeSchedule = require('./services/showService')

scrapeSchedule.schedule()

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/shows', shows)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message
  console.log(err)
  res.status(err.status || 500)
  res.send({
    error: err
  })
})

app.listen(3000, () => {
  console.log('listening to port 3000')
})

module.exports = app