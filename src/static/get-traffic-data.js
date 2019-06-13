const fetch = require('node-fetch')
const R = require('ramda')

/* This is in min lat, min lon, max lat, max lon format. */
const bounding = '52.290331,4.738163,52.462449,5.135141'
const key = 'OUxx6J2lpUlbEuZ7sBfzhvPKUAKFbJ0F'

/* Requests all current incidents for a bounding box defined above. */
var getTrafficData = () => {
  const url = `https://api.tomtom.com/traffic/services/4/incidentDetails/s3/${bounding}/11/1335294634919/json?key=${key}&projection=EPSG4326&originalPosition=true&expandCluster=true`

  return fetch(url)
    .then(d => d.json())
    .catch(e => console.log(e))
}

var post = () => {
  getTrafficData()
    .then(d => d['tm']['poi'])
    .then(data  => {

      /* First target all clusters from API data. */
      const isCluster = incident => R.prop("id", incident).includes("CLUSTER")
      let clusters = R.takeWhile(isCluster, data)

      /* Now extract all incidents from the cluster and extract all single
       * incidents. */
      let incidents_from_cluster = R.flatten(R.map(R.prop('cpoi'), clusters))
      let single_incidents = R.dropWhile(isCluster, data)

      var data = [...single_incidents, ...incidents_from_cluster]
      console.log(data)
    })
    .catch(e => console.log(e))
}

var main = () => {
  post()
}

main()
