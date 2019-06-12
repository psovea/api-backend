const fs = require('fs')
const fetch = require('node-fetch')
const R = require('ramda') // might feel like using this later for rewriting our data ;)

/* This is in min lat, min lon, max lat, max lon format. */
const bounding = '52.290331,4.738163,52.462449,5.135141'
const key = 'ASK ERIC FOR API KEY'

/* Requests all current incidents for a bounding box defined above. */
var getTrafficData = () => {
  const url = `https://api.tomtom.com/traffic/services/4/incidentDetails/s3/${bounding}/11/1335294634919/json?key=${key}&projection=EPSG4326&originalPosition=true`

  return fetch(url)
    .then(d => d.json())
    .catch(e => console.log(e))
}

var post = () => { 
  getTrafficData()
    .then(d => d['tm']['poi'])
    .then(poi => console.log(poi))
}

var main = () => {
  post()
}

main()
