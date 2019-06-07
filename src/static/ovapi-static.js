/*
 * STAAT NU IN get-static-data.js
 */

const fetch = require('node-fetch');
const fs = require('fs');
const R = require('ramda');

var keys = Object.keys(JSON.parse(fs.readFileSync('data/timepoint_keys.json')));

var chunkArray = (myArray, chunk_size) => {
  var index = 0;
  var arrayLength = myArray.length;
  var tempArray = [];

  for (index = 0; index < arrayLength; index += chunk_size) {
    myChunk = myArray.slice(index, index+chunk_size);
    tempArray.push(myChunk);
  }

  return tempArray;
}

var request = (uri) => {
  fetch("https://v0.ovapi.nl/tpc/" + uri)
    .then(d => {
      return d.json();
    })
    .catch(e => console.log(e))
}

var uris = chunkArray(keys, keys.length / 200).map(x => x.join(","));

var stops = () => {
  return Promise.all(uris.map(uri =>
    fetch("https://v0.ovapi.nl/tpc/" + uri)
      .then(data => data.json())
      .catch(e => console.log(e))
    )).then(R.compose(JSON.stringify, R.mergeAll))
}

module.exports = stops
