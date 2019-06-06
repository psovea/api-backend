/*
 * Get the neccessary information for every stop in Amsterdam.
 */

const fs = require('fs')

var main = () => {
  var amsterdamTimeStops = JSON.parse(fs.readFileSync('data/amsterdam_data.json'))
  var stops = []

  amsterdamTimeStops.forEach(stop => {
    stops.push({
      [stop.Stop.TimingPointCode]: {
        lat: stop.Stop.Latitude,
        lon: stop.Stop.Longitude,
        name: stop.Stop.TimingPointName,
        accessibility: {
          wheelchair: !!('ACCESSIBLE'),
          visual: !!('ACCESSIBLE')
        }
      }
    })
  })

  fs.writeFileSync('data/amsterdam_stops.json', JSON.stringify(stops))
}

main()
