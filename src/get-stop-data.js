/*
 * NIET MEER NODIG
 */

const fs = require('fs');

var main = () => {
  amsterdam_timestops = JSON.parse(fs.readFileSync('data/timepoint_data.json'));
  stops = [];

  amsterdam_timestops.forEach(stop => {
    stops.push({
      [stop.Stop.TimingPointCode]: {
        lat: stop.Stop.Latitude,
        lon: stop.Stop.Longitude,
        name: stop.Stop.TimingPointName,
        town: stop.Stop.TimingPointTown,
        areaCode: stop.Stop.StopAreaCode,
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
