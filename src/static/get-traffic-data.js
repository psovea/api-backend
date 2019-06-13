const fetch = require('node-fetch')
const R = require('ramda')

/* This is in min lat, min lon, max lat, max lon format. */
const bounding = '52.290331,4.738163,52.462449,5.135141'

/* Create a .env file in the root of this repo in the following
 * format: TOMTOM_KEY=KEY */
const key = require('dotenv').config().parsed.TOMTOM_KEY

/* Requests all current incidents for a bounding box defined above. */
var getTrafficData = () => {
  const url = `https://api.tomtom.com/traffic/services/4/incidentDetails/s3/${bounding}/11/1335294634919/json?key=${key}&projection=EPSG4326&originalPosition=true&expandCluster=true`

  return fetch(url)
    .then(d => d.json())
    .catch(e => console.log(e))
}

var post = () => {
  return getTrafficData()
    .then(d => d['tm']['poi'])
    .then(data  => {

      /* First target all clusters from API data. */
      const isCluster = incident => R.test(/CLUSTER/, R.prop("id", incident))
      let clusters = R.filter(isCluster, data)

      /* Now extract all incidents from the cluster and extract all single
       * incidents. */
      let incidents_from_cluster = R.flatten(R.map(R.prop('cpoi'), clusters))
      let single_incidents = R.reject(isCluster, data)

      return [...single_incidents, ...incidents_from_cluster]
    })
    .catch(e => console.log(e))
}

module.exports = {
  post: post
}
