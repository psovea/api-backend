var fs = require('fs')

var router = (app) => {
  app.get('/districts', (req, res) => {
    var stopData = JSON.parse(fs.readFileSync('../data/districts.geojson'))
    res.status(200).send(stopData)
  })
}

module.exports = router
