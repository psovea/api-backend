var xmlParser = require("xml2json");
var zlib = require("zlib");
var zmq = require('zeromq');

var socket = zmq.socket('sub');
var endpoint = 'tcp://pubsub.besteffort.ndovloket.nl:7658';

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
        console.log(json)
    });
})

socket.connect(endpoint)
socket.subscribe('/GVB/')
