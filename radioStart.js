var spotApi = require('./spotify')
var CronJob = require('cron').CronJob
var { pickTrackProps } = require('./helpers')
var { server } = require('./config')
const WebSocket = require('ws')
var clients = {}
var { Listening, Radio } = require('./models')

const socket = new WebSocket.Server({server})
socket.on('connection', function connection (ws) {
  ws.on('message', function incoming (message) {
    let msgobj = JSON.parse(message)
    if (msgobj.type === 'USERID') {
      clients[msgobj.userId] = ws
    }
  })
})

function getRandInd (count) {
  return Math.floor(Math.random() * count)
}

function nextSong (r) {
  var goToNext = function () {
    Radio.findOne({
      _id: r._id
    }, function (err, radio) {
      if (err) {
        console.log(err)
        return
      }
      let nextSong = ''
      if (radio.upNext.length !== 0) {
        nextSong = radio.upNext.shift()
      } else {
        nextSong = radio.songs[getRandInd(radio.songs.length)]
      }
      // TODO: cache tracks instead of querying API every time
      // Also: get all tracks at once?
      spotApi.getTrack(nextSong)
        .then((trackRes) => {
          radio.currentSong = pickTrackProps(trackRes)
          radio.save((err, savedRadio) => {
            if (err) {
              console.log(err)
            }
            Listening.find({
              radioId: savedRadio._id
            }, (err, listens) => {
              if (err) {
                // better error handling would be good
                console.log(err)
                return
              }
              listens.forEach((listen) => {
                if (!clients[listen.userId]) {
                  return
                }
                // make sure you reload the client when you restart the server, in order to get the websocket connection back
                clients[listen.userId].send(JSON.stringify(savedRadio.currentSong))
              })
            })
            startRadio(savedRadio)
          })
        })
    })
  }
  return goToNext
}

function startRadio (radio) {
  let dateObj = Date.now()
  dateObj += radio.currentSong.duration_ms
  radio.currentSongStarted = new Date()
  radio.save()
  let cronTime = new Date(dateObj)
  let job = new CronJob({
    cronTime,
    onTick: nextSong(radio),
    start: false,
    timeZone: 'America/New_York'
  })
  job.start()
}

module.exports = startRadio
