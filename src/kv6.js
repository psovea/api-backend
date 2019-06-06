const xmlParser = require("xml2json");
const zlib = require("zlib");
const zmq = require('zeromq');
const request = require('request')

var socket = zmq.socket('sub');
var endpoint = 'tcp://pubsub.besteffort.ndovloket.nl:7658';

const LINE_NUMBER = "22"
const TYPE = "ARRIVAL"

/* Create punctuality metric for given object. */
var createMetric = (obj) => {
  if (!obj || !obj[TYPE]) { return null; }

  var retobj = obj[TYPE];

  return {
    "metrics": {
      "punctuality": retobj["punctuality"]
    },
    "meta": {
      //"stop_number": retobj["userstopcode"],
      "operator_name": retobj["dataownercode"],
      "line_number": retobj["lineplanningnumber"],
      "vehicle_number": retobj["vehiclenumber"]
    }
  }
}

/* Check if object is a list. */
var isList = (obj) => {
  try {
    return obj.length >= 1
  } catch {
    return false;
  }
}

/* Filter arrival data for a specific type and line number. */
var filterArrivals = (type, lineNum) => (obj) => {
  var t = Object.keys(obj)[0];
  return t == type && obj[type]["lineplanningnumber"] == lineNum
}

/* Parse an incoming message from the openov stream.*/
var parseMessage = (message) => {
  var pos_info = null;

  try {
    pos_info = JSON.parse(message)['VV_TM_PUSH']['KV6posinfo']
  } catch {
    return [];
  }

  if (isList(pos_info)) {
    return pos_info.filter(filterArrivals(TYPE, LINE_NUMBER)).map(createMetric).filter(x => x != null);
  } else {
    var ret = filterArrivals(TYPE, LINE_NUMBER) ? createMetric(pos_info) : null;
    return ret ? [ret] : [];
  }
}

/* Generate options for post request. */
var options = data => {
  return {
    uri: 'http://18.216.203.6:5000/insert-metrics',
    method: 'POST',
    json: data
  }
};

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
            console.error(err);
            return;
        }

        /* Convert the retrieved XML to JSON. */
        var xmlString = buffer.toString();
        var json = xmlParser.toJson(xmlString);
        var mes = parseMessage(json);

        if (mes && mes.length >= 1) {
          console.log(mes)
          postReq(mes);
        }
    });
})

socket.connect(endpoint)
socket.subscribe('/GVB/')
