/*
 * Get the neccessary information for every stop in Amsterdam.
 */

const fs = require('fs');

var main = () => {
  amsterdam_timestops = JSON.parse(fs.readFileSync('data/amsterdam_data.json'));
  stops = [];

  amsterdam_timestops.forEach(stop => {
    stops.push({
      [stop.Stop.TimingPointCode]: {
        lat: stop.Stop.Latitude,
        lon: stop.Stop.Longitude,
        name: stop.Stop.TimingPointName,
        accessibility: {
          wheelchair: ('ACCESSIBLE') ? true : false,
          visual: ('ACCESSIBLE') ? true : false
        }
      }
    })
  })

  fs.writeFileSync('data/amsterdam_stops.json', JSON.stringify(stops));
}

main();
