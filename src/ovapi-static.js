const fetch = require('node-fetch')
const fs = require('fs')

var keys = Object.keys(JSON.parse(fs.readFileSync('data/timepoint_keys.json')))

function chunkArray (myArray, chunkSize) {
  var index = 0
  var arrayLength = myArray.length
  var tempArray = []

  for (index = 0; index < arrayLength; index += chunkSize) {
    var myChunk = myArray.slice(index, index + chunkSize)
    tempArray.push(myChunk)
  }

  return tempArray
}

var uris = chunkArray(keys, keys.length / 200).map(x => x.join(','))

var main = () => {
  Promise.all(uris.map(uri =>
    fetch('https://v0.ovapi.nl/tpc/' + uri)
      .then(data => data.json())
      .catch(e => console.log(e))
  )).then(data => fs.writeFileSync('data/timepoint_data.json', JSON.stringify(data)))
}

main()
