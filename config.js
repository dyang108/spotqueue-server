// Set up server and socket
var app = require('express')()
var bodyParser = require('body-parser')
var server = require('http').createServer(app)
// DB imports
var mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
const port = 8000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// connect to the database
var url = 'mongodb://localhost:27017/spotqueue'
mongoose.connect(url)
var db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  server.listen(port, () => {
    console.log('App running on port ' + port)
  })
})

module.exports = {
  server,
  app
}
