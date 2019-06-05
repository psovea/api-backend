const fetch = require('node-fetch');
const fs = require('fs');

var keys = Object.keys(JSON.parse(fs.readFileSync('timepoint_keys.json')));

function chunkArray(myArray, chunk_size){
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

var main = () => {
  Promise.all(uris.map(uri =>
    fetch("https://v0.ovapi.nl/tpc/" + uri)
      .then(data => data.json())
      .catch(e => console.log(e))
  )).then(data => fs.writeFileSync("timepoint_data.json", JSON.stringify(data)))
}

main();
