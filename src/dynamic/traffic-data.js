const fs = require('fs')
const fetch = require('node-fetch')
const R = require('ramda') 

// This is in min lat, min lon, max lat, max lon format.
const bounding = '52.290331,4.738163,52.462449,5.135141'
const key = 'ASK ERIC FOR KEY'

// Given a bounding box, will find all congestions, events, incidents and
// construction.
const getTrafficData = (key, bounding) => {
  const url = `https://api.tomtom.com/traffic/services/4/incidentDetails/s3/${bounding}/11/1335294634919/json?key=${key}&projection=EPSG4326&originalPosition=true`
  return fetch(url).then(data => data.json()).catch(err => console.log(err))
}


const data = getTrafficData(key, bounding).then(data =>
  fs.writeFile('test.json', JSON.stringify(data), 'utf8', (err) => {
    console.log('done')
  })
)


//const data = JSON.parse(fs.readFileSync('test.json', 'utf8'))
const incidents = data['tm']['poi']
