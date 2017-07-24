var mongoose = require('mongoose')
var Schema = mongoose.Schema

var SongId = String // TODO: change this with actual format of song id

/*
Schemas
  User schema:
    _id: ObjectId
    username: String
    firstName: String
    lastName: String
    friends: [ObjectId]
    currentRadio: ObjectId <-- foreign key to Radio
  Radio schema:
    _id: ObjectId
    title: String
    currentSong: SongId <-- foreign key to Spotify song
    includes: [SongIds]
    upNext: [SongIds]
*/

var User = mongoose.model('User', {
  // should be identical to the Facebook userID from the SDK
  userId: { type: String, unique: true },
  bio: String,
  friends: [String],
  firstName: String,
  lastName: String,
  gender: String,
  photoUrl: String
})

var Radio = mongoose.model('Radio', {
  title: String,
  currentSong: Object,
  // used to figure out where to start the radio from
  currentSongStarted: Date,
  songs: [SongId],
  upNext: [SongId]
})

var Listening = mongoose.model('Listening', {
  userId: { type: String, unique: true },
  radioId: Schema.Types.ObjectId
})

module.exports = {
  User,
  Radio,
  Listening
}
