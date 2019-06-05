var xmlParser = require("xml2json");
var zlib = require("zlib");
var zmq = require('zeromq');

var socket = zmq.socket('sub');
var endpoint = 'tcp://pubsub.besteffort.ndovloket.nl:7658';

const LINE_NUMBER = "22"
const TYPE = "ARRIVAL"

var createObj = (obj) => {
  if (!obj || !obj[TYPE]) { return null; }

  var retobj = obj[TYPE];

  return {
    "stop_number": retobj["userstopcode"],
    "punctuality": retobj["punctuality"],
    "operator_name": retobj["dataownercode"],
    "line_number": retobj["lineplanningnumber"],
    "vehicle_number": retobj["vehiclenumber"]
  }
}

var isList = (obj) => {
  try {
    return obj.length >= 1
  } catch {
    return false;
  }
}

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
    return pos_info.filter(filterArrivals(TYPE, LINE_NUMBER)).map(createObj).filter(x => x != null);
  } else {
    var ret = filterArrivals(TYPE, LINE_NUMBER) ? createObj(pos_info) : null;
    return ret ? [ret] : [];
  }
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
          // TODO: Post request database
          console.log(mes)
        }
    });
})

socket.connect(endpoint)
socket.subscribe('/GVB/')
