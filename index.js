var { User, Radio, Listening } = require('./models')
// connection to spotify
var spotApi = require('./spotify')
var { app } = require('./config')
// standard dependencies
var Promise = require('bluebird')
var startRadio = require('./radioStart')
var { pickTrackProps } = require('./helpers')

Radio.find({}).cursor().eachAsync((doc) => {
  startRadio(doc)
})

// ALWAYS use userId, not objectId
app.route('/user/:userId')
  .get((req, res, next) => {
    User.findOne({ userId: req.params.userId }, (err, item) => {
      if (err) {
        res.sendStatus(500)
        return
      }
      res.json(item)
    })
  })
  .post((req, res, next) => {
    User.findOneAndUpdate({ username: req.params.username }, req.body, {new: true}, (err, userObj) => {
      if (err) {
        res.sendStatus(500)
        return
      }
      res.json(userObj)
    })
  })

app.route('/user')
  .post((req, res, next) => {
    var newUser = new User(req.body)
    newUser.save((err, userObj) => {
      if (err) {
        res.sendStatus(500)
        return
      }
      res.json(userObj)
    })
  })

app.route('/radio/:id/:user')
  .get((req, res, next) => {
    Radio.findOne({
      _id: req.params.id
    }, (err, radio) => {
      if (err) {
        res.sendStatus(500)
        return
      }
      Listening.findOne({
        userId: req.params.user
      }, (err, listen) => {
        if (err) {
          res.sendStatus(500)
          return
        }
        if (!listen) {
          listen = new Listening({
            userId: req.params.user,
            radioId: req.params.id
          })
        } else {
          listen.radioId = radio._id
        }
        listen.save((err) => {
          if (err) {
            res.sendStatus(500)
            return
          }
          res.json(radio)
        })
      })
    })
  })

app.route('/stop/:id/:user')
  .get((req, res, next) => {
    Listening.findOne({
      userId: req.params.user
    }, (err, listen) => {
      if (err) {
        res.sendStatus(500)
        return
      }
      listen.radioId = null
      listen.save((err) => {
        if (err) {
          console.log(err)
          res.sendStatus(500)
          return
        }
        res.sendStatus(200)
      })
    })
  })

app.route('/queue')
  .post((req, res, next) => {
    Radio.findOne({
      _id: req.body.radioId
    }, (err, radio) => {
      if (err) {
        console.log(err)
        res.sendStatus(500)
        return
      }
      if (!radio.upNext) {
        radio.upNext = []
      }
      radio.upNext.push(req.body.songId)
      radio.save((err, savedRadio) => {
        if (err) {
          res.sendStatus(500)
          return
        }
        res.json(savedRadio)
      })
    })
  })

app.route('/radio/:id')
  .post((req, res, next) => {
    Radio.findByIdAndUpdate(req.params.id, req.body, (err, result) => {
      if (err) {
        res.sendStatus(500)
        return
      }
      res.sendStatus(200)
    })
  })

app.route('/radio')
  .post((req, res, next) => {
    if (req.body.songs.length === 0) {
      res.sendStatus(300)
      return
    }
    // check if the radio already exists here...
    spotApi.getTrack(req.body.songs[0])
      .then((trackRes) => {
        let radioJson = req.body
        radioJson.currentSong = pickTrackProps(trackRes)
        radioJson.currentSongStarted = new Date()
        radioJson.upNext = []
        return Promise.resolve(radioJson)
      }).then((radioJson) => {
        let newRadio = new Radio(radioJson)
        newRadio.save((err, savedRadio) => {
          if (err) {
            res.sendStatus(500)
          }
          res.json(savedRadio)
          startRadio(newRadio)
        })
      })
  })
  .get((req, res, next) => {
    Radio.find({}, (err, items) => {
      if (err) {
        res.sendStatus(500)
        return
      }
      res.json(items)
    })
  })
  .delete((req, res, next) => {
    // TODO: this. on client too.
    // Radio.
  })
