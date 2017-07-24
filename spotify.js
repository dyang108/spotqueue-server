var { SpotifyCredentials } = require('./secret')
var SpotifyWebApi = require('spotify-web-api-node')
var spotApi = new SpotifyWebApi(SpotifyCredentials)
var CronJob = require('cron').CronJob
var moment = require('moment')

var getToken = () => {
  spotApi.clientCredentialsGrant()
    .then(function (data) {
      console.log(data.body)
      spotApi.setAccessToken(data.body.access_token)
      let cronTime = (moment().add(data.body.expires_in - 5, 'seconds')).toDate()
      let job = new CronJob({
        cronTime,
        onTick: getToken,
        start: false,
        timeZone: 'America/New_York'
      })
      job.start()
    }, function (err) {
      console.log('Something went wrong when retrieving an access tokent', err)
    })
}
getToken()

module.exports = spotApi
