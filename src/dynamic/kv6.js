const xmlParser = require('xml2json')
const zlib = require('zlib')
const zmq = require('zeromq')
const request = require('request')

var socket = zmq.socket('sub')
var endpoint = 'tcp://pubsub.besteffort.ndovloket.nl:7658'

const LINE_NUMBER = '22'
const TYPE = 'ARRIVAL'
const EXPIRY_TIME = 1800

var prevVehicleInfo = {}
var stationPunctualityCounter = {}

// update the stop punctuality delay counter using the new arrival data;
// calculates the increase in delay between last stop and current stop,
// and adds that difference to a specific counter.
var updateStopPunctuality = (retobj) => {
  var time = Date.now()

  if (retobj['vehiclenumber'] in prevVehicleInfo &&
    prevVehicleInfo[retobj['vehiclenumber']]['time'] + EXPIRY_TIME < time &&
    retobj['punctuality'] - prevVehicleInfo[retobj['vehiclenumber']]['prev_punc'] > 0) {
    var beginStop = prevVehicleInfo[retobj['vehiclenumber']]['prev_stop']
    var endStop = retobj['userstopcode']
    var prev = 0
    if (beginStop in stationPunctualityCounter &&
      stationPunctualityCounter.hasOwnProperty(beginStop) &&
      endStop in stationPunctualityCounter[beginStop] &&
      stationPunctualityCounter.hasOwnProperty(endStop)) {
      prev = stationPunctualityCounter[beginStop][endStop]
    }
    if (stationPunctualityCounter[beginStop] === undefined) {
      stationPunctualityCounter[beginStop] = {}
    }
    stationPunctualityCounter[beginStop][endStop] = (
      prev + parseInt(retobj['punctuality']) - prevVehicleInfo[retobj['vehiclenumber']]['prev_punc'])
  }

  prevVehicleInfo[retobj['vehiclenumber']] = {
    'time': time,
    'prev_stop': retobj['userstopcode'],
    'prev_punc': parseInt(retobj['punctuality'])
  }
}

/* Create punctuality metric for given object. */
var createMetric = (obj) => {
  if (!obj || !obj[TYPE]) { return null }

  var retobj = obj[TYPE]

  updateStopPunctuality(retobj)

  var metrics = []

  metrics.push({
    'metrics': {
      'punctuality': retobj['punctuality']
    },
    'meta': {
      // "stop_number": retobj["userstopcode"],
      'operator_name': retobj['dataownercode'],
      'line_number': retobj['lineplanningnumber'],
      'vehicle_number': retobj['vehiclenumber']
    }
  })
  return metrics
}

/* Check if object is a list. */
var isList = (obj) => {
  try {
    return obj.length >= 1
  } catch (e) {
    return false
  }
}

/* Filter arrival data for a specific type and line number. */
var filterArrivals = (type, lineNum) => (obj) => {
  var t = Object.keys(obj)[0]
  return t === type && obj[type]['lineplanningnumber'] === lineNum
}

/* Parse an incoming message from the openov stream. */
var parseMessage = (message) => {
  var posInfo = null

  try {
    posInfo = JSON.parse(message)['VV_TM_PUSH']['KV6posinfo']
  } catch (e) {
    return []
  }

  var newMetrics = []

  if (isList(posInfo)) {
    var metrics = posInfo.filter(filterArrivals(TYPE, LINE_NUMBER)).map(createMetric).filter(x => x != null)
    for (var i = 0; i < metrics.length; i++) {
      newMetrics = newMetrics.concat(metrics[i])
    }
  } else {
    var ret = filterArrivals(TYPE, LINE_NUMBER) ? createMetric(posInfo) : null
    newMetrics = ret || []
  }
  for (var begin in stationPunctualityCounter) {
    for (var end in stationPunctualityCounter[begin]) {
      newMetrics.push({
        'metrics': {
          'location_punctuality': stationPunctualityCounter[begin][end]
        },
        'meta': {
          'stop_begin': begin,
          'stop_end': end
        }
      })
    }
  }
  return newMetrics
}

/* Generate options for post request. */
var options = data => {
  return {
    uri: 'http://18.216.203.6:5000/insert-metrics',
    // uri: 'http://localhost:5000',
    method: 'POST',
    json: data
  }
}

/* Send post request to prometheus db. */
var postReq = (data) => {
  request(options(data), JSON.stringify(data),
    (error, res, body) => {
      if (error) {
        console.error(error)
        return
      }
      console.log(`statusCode: ${res.statusCode}`)
      console.log(body)
    })
}

/* Listen to messages from ndovloket and parse the data. */
socket.on('message', (topic, msg) => {
  zlib.gunzip(msg, (err, buffer) => {
    if (err) {
      console.error(err)
      return
    }

    /* Convert the retrieved XML to JSON. */
    var xmlString = buffer.toString()
    var json = xmlParser.toJson(xmlString)
    var mes = parseMessage(json)

    if (mes && mes.length >= 1) {
      console.log(mes)
      postReq(mes)
    }
  })
})

socket.connect(endpoint)
socket.subscribe('/GVB/')
