var fs = require('fs')

var router = (app) => {
  app.get('/districts', (req, res) => {
    var stopData = JSON.parse(fs.readFileSync('../data/sd2010zw_region.geojson'))
    res.status(200).send(stopData)
  })
}

module.export = router
