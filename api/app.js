var express = require('express')
var bodyParser = require('body-parser')

var index = require('./routes/index')
var districts = require('./routes/districts')
var traffic = require('./traffic/get-traffic-incidents')

var app = express()

/* The server accepts both JSON and url encoded values (used for parameters) */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

/* Add every end point */
index(app)
districts(app)
traffic(app)

/* Listen on port 3000 */
var server = app.listen(3000, () => {
  console.log('Running on port ' + server.address().port)
})
