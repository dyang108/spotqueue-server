var _ = require('lodash')

function pickTrackProps (trackRes) {
  return _.pick(trackRes.body, ['id', 'name', 'popularity', 'artist', 'album', 'album', 'duration_ms'])
}

module.exports = {
  pickTrackProps
}
