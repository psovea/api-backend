/*
 * STAAT NU IN get-static-data.js
 */
const fetch = require('node-fetch');
const fs = require('fs');

var perLine = () => {
    fetch("https://v0.ovapi.nl/journey/")
    .then(data => data.json())
    .then(json => fs.writeFileSync("data/stops_per_line.json", JSON.stringify(json).replace(/([A-Z]+)_\d+_([A-Za-z0-9]+)_\d+_\d+/g, "$1_$2")))
}

module.exports = perLine
