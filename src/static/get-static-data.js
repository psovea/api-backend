/*
 * Combines all seperate features of acquiring the two datasets
 * (routes and stops) in JSON which are then sent to the database.
 */

const fs = require('fs')
const fetch = require('node-fetch')
const R = require('ramda')
const request = require('request')

const HOUR = 100 * 60 * 60

var getStopIDs = () => {
  return fetch('https://v0.ovapi.nl/tpc/')
}

/* Request information about a single stop. */
var requestStop = (uri) => {
  return fetch('https://v0.ovapi.nl/tpc/' + uri)
    .then(d => d.json())
    .catch(e => console.log(e))
}

/* Splits all the id's of the stops into an array of 200 elements (the request
 * url would be too large if we didn't) and joins them, giving us an array of
 * uris to request.
 * */
var uris = keys => R.compose(
  R.map(R.join(',')),
  R.splitEvery(keys.length / 200)
)(keys)

/* Get all stop information. */
var stops = (uri) => {
  return Promise.all(R.map(requestStop, uri))
    .then(R.mergeAll)
}

/* Get all stops per line. */
var stopsPerLine = () => {
  return fetch('https://v0.ovapi.nl/journey/')
    .then(data => data.json())
    /* We only need the first and the third id from the key. */
    .then(R.compose(
      JSON.parse,
      R.replace(/([A-Z]+)_\d+_([A-Za-z0-9]+)_\d+_\d+/g, '$1_$2'),
      R.toString)
    )
}

/* Generate options for post request. */
var options = (endpoint, data) => {
  return {
    uri: 'http://18.216.203.6:5000' + endpoint,
    method: 'POST',
    json: data
  }
}

/* Send post request to prometheus db. */
var postReq = (endpoint, data) => {
  request(options(endpoint, data), JSON.stringify(data),
    (error, res, body) => {
      if (error) {
        console.error(error)
        return
      }
      console.log(`statusCode: ${res.statusCode}`)
      console.log(body)
    })
}

/* Retrieve information about all lines. */
var getRoutes = (timeStops, dataLines) => {
  var routes = {}
  var keys = R.keys(timeStops)

  keys.forEach(k => {
    var e = timeStops[k]
    var passes = R.keys(e['Passes'])

    passes.forEach(p => {
      /* Extract all needed information. */
      var obj = e['Passes'][p]
      var operatorCode = obj['OperatorCode']
      var lineCode = obj['LinePlanningNumber']
      var transportType = obj['TransportType']
      var stopCode = obj['TimingPointCode']
      var orderNumber = obj['UserStopOrderNumber']
      var newP = p.replace(/([A-Z]+)_\d+_([A-Za-z0-9]+)_\d+_\d+/g, '$1_$2')
      var numStops = dataLines[newP]
      var direction = obj['LineDirection']
      var destName = obj['DestinationName50']
      var lineName = obj['LineName']
      var publicName = obj['LinePublicNumber']

      /* Check if this operator code has already been added to the object. */
      if (!routes[operatorCode]) {
        routes[operatorCode] = {}
      }

      /* Check if this line code has already been added to the object. */
      if (!routes[operatorCode][lineCode]) {
        routes[operatorCode][lineCode] = {
          'lineName': lineName,
          'destinationName': destName,
          'direction': direction,
          'lineNumberName': publicName,
          'transportType': transportType,
          'totalStops': numStops || -1,
          'stops': []
        }
      }

      routes[operatorCode][lineCode]['stops'].push({
        stopCode: stopCode,
        orderNumber: orderNumber
      })

      /* Make sure that all stops are unique. */
      routes[operatorCode][lineCode]['stops'] = R.uniq(
        routes[operatorCode][lineCode]['stops']
      )
    })
  })

  postReq('/insert-static', routes)
  console.log('succesfully written route data.')
}

/* Create stop object, which contains information such as lat, lon and name. */
var getStops = (timeStops) => {
  var keys = Object.keys(timeStops)
  var stops = keys.map(key => {
    var stop = timeStops[key]

    return {
      [stop.Stop.TimingPointCode]: {
        lat: stop.Stop.Latitude,
        lon: stop.Stop.Longitude,
        name: stop.Stop.TimingPointName,
        town: stop.Stop.TimingPointTown,
        areaCode: stop.Stop.StopAreaCode,
        accessibility: {
          wheelchair: !!('ACCESSIBLE'),
          visual: !!('ACCESSIBLE')
        }
      }
    }
  })

  postReq('/insert-static-stops', R.mergeAll(stops))

  console.log('succesfully written all stops.')
}

var post = () => {
  /* Retrieve the id's for all stops and retrieve information regarding them.
   * */
  getStopIDs()
    .then(d => d.json())
    .then(keys => {
      Promise.all([stopsPerLine(), stops(uris(R.keys(keys)))])
        .then(d => {
          var dataLines = d[0]
          var timeStops = d[1]
          getStops(timeStops)
          getRoutes(timeStops, dataLines)
        })
        .catch(e => console.log(e))
    })
    .catch(e => console.log(e))
}

var main = () => {
  post()
}

main()
