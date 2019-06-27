/* server.js:
 * Server side socket that the frontend can connect to to retrieve
 * live information regarding incoming delays.
 * */

const xmlParser = require('xml2json')
const zlib = require('zlib')
const zmq = require('zeromq')
const R = require('ramda')
const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const path = require('path')

const MIN_DELAY = 180

var socket = zmq.socket('sub')
var endpoint = 'tcp://pubsub.besteffort.ndovloket.nl:7658'

/* Set up miniserver */
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'frontend', 'public', 'index.html'))
})

app.get('/bundle.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'frontend', 'public', 'bundle.js'))
})

http.listen(3500, function () {
  console.log('listening on *:3500')
})

/* Filter arrival data for a specific type. */
var filterDelaysFor = (type, message) => {
  let posInfo = R.tryCatch(
    R.path(['VV_TM_PUSH', 'KV6posinfo']),
    R.always([])
  )(message)

  let path = [type, 'punctuality']

  let hasPunctuality = R.hasPath(path)

  let isDelayed = R.compose(
    R.gt(R.__, MIN_DELAY),
    parseInt,
    R.path(path)
  )

  /* Find all objects that are delayed and have a punctuality
   * object.
   * */
  return R.tryCatch(
    R.filter(R.both(hasPunctuality, isDelayed)),
    R.always([]))(posInfo)
}

io.on('connection', s => {
  console.log('connection!')

  /* Listen to messages from ndovloket and parse the data. */
  socket.on('message', (topic, msg) => {
    zlib.gunzip(msg, (err, buffer) => {
      if (err) {
        console.error(err)
        return
      }

      /* Convert retrieved XML to JSON. */
      let xmlString = buffer.toString()
      let json = JSON.parse(xmlParser.toJson(xmlString))

      let delays = filterDelaysFor('ARRIVAL', json)

      if (R.not(R.isEmpty(delays))) {
        console.log(delays)
        R.forEach((delay) => {
          s.emit('message', JSON.stringify(delay))
        }, delays)
      }
    })
  })
})

socket.connect(endpoint)
socket.subscribe('/GVB/')
