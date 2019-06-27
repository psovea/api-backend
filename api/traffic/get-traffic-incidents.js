/*
 * Very basic endpoint that sends all stops in Amsterdam in a JSON file.
 *
 * Further improvements:
 * - Add a parameter that filters specific stops (short/medium-term)
 * - Make it possible to get stops for locations other than Amsterdam (long-term)
 */

const getTrafficData = require('../../src/static/get-traffic-data')

var router = (app) => {
  app.get('/getIncidents', (req, res) => {
    getTrafficData.post().then(incidents => res.status(200).send(incidents))
  })
}

module.exports = router
