/*
 * Ccombines all seperate features of acquiring the two datasets
 * (routes and stops) in JSON.
 *
 *  TO DO:
 * - get timepoint_keys.json directly from API
 * - create script that runs this code periodically
 * - create modules to clean up this code
 * - create POST request to send data to database
 */

const fs = require('fs');
const fetch = require('node-fetch');
const R = require('ramda')

var keys = Object.keys(JSON.parse(fs.readFileSync('data/timepoint_keys.json')));

var chunkArray = (myArray, chunk_size) => {
  var index = 0;
  var arrayLength = myArray.length;
  var tempArray = [];

  for (index = 0; index < arrayLength; index += chunk_size) {
    myChunk = myArray.slice(index, index+chunk_size);
    tempArray.push(myChunk);
  }

  return tempArray;
}

var request = (uri) => {
  fetch("https://v0.ovapi.nl/tpc/" + uri)
    .then(d => {
      return d.json();
    })
    .catch(e => console.log(e))
}

var uris = chunkArray(keys, keys.length / 200).map(x => x.join(","));

var stops = () => {
  return Promise.all(uris.map(uri =>
    fetch("https://v0.ovapi.nl/tpc/" + uri)
      .then(data => data.json())
      .catch(e => console.log(e))
    )).then(R.compose(JSON.stringify, R.mergeAll))
}

var stopsPerLine = () => {
    return fetch("https://v0.ovapi.nl/journey/")
    .then(data => data.json())
    .then(json => JSON.stringify(json).replace(/([A-Z]+)_\d+_([A-Za-z0-9]+)_\d+_\d+/g, "$1_$2"))

}

var getRoutes = (timeStops, dataLines) => {
    var routes = {}
    var keys = Object.keys(timeStops)

    keys.forEach(k => {
        var e = timeStops[k];
        var passes = Object.keys(e["Passes"]);

        passes.forEach(p => {
            var obj = e["Passes"][p];
            var operatorCode = obj["OperatorCode"];
            var lineCode = obj["LinePlanningNumber"];
            var transportType = obj["TransportType"];
            var stopCode = obj["TimingPointCode"];
            var orderNumber = obj["UserStopOrderNumber"];
            var newP = p.replace(/([A-Z]+)_\d+_([A-Za-z0-9]+)_\d+_\d+/g, "$1_$2");
            var numStops = dataLines[newP];
            var direction = obj["LineDirection"];
            var destName = obj["DestinationName50"];
            var lineName = obj["LineName"];
            var publicName = obj["LinePublicNumber"];

            if (!routes[operatorCode]) {
                routes[operatorCode] = {}
            }

            if (!routes[operatorCode][lineCode]) {
                routes[operatorCode][lineCode] = {
                    "lineName" : lineName,
                    "destinationName" : destName,
                    "direction" : direction,
                    "lineNumberName" : publicName,
                    "transportType" : transportType,
                    "totalStops" : numStops ? numStops : -1,
                    "stops" : []
                }
            }

            routes[operatorCode][lineCode]["stops"].push({
                stopCode: stopCode,
                orderNumber: orderNumber
            })

            routes[operatorCode][lineCode]["stops"] = R.uniq(routes[operatorCode][lineCode]["stops"]);
        })
    })
    fs.writeFileSync("data/route_data1.json", JSON.stringify(routes))
}

var getStops = (timeStops) => {
    stops = [];

    var keys = Object.keys(timeStops)
    keys.forEach(k => {
      var stop = timeStops[k]
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
    fs.writeFileSync('data/all_stops.json', JSON.stringify(stops));
}

var main = () => {
    Promise.all([stopsPerLine(), stops()])
    .then(d => {
        getStops(JSON.parse(d[1]))
        getRoutes(JSON.parse(d[1]), JSON.parse(d[0]))
    })
    .catch(e => console.log(e))
}

main();
