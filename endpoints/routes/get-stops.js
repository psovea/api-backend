/*
 * Very basic endpoint that sends all stops in Amsterdam in a JSON file.
 *
 * Further improvements:
 * - Add a parameter that filters specific stops (short/medium-term)
 * - Make it possible to get stops for locations other than Amsterdam (long-term)
 */

var fs = require('fs');

var router = (app) => {
  app.get('/getStops', (req, res) => {
    var stopData = JSON.parse(fs.readFileSync('../data/amsterdam_stops.json'));

    res.status(200).send(stopData);
  })
}

module.exports = router;
