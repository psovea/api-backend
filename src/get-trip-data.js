/*
 * STAAT NU IN get-static-data.js
 */

const fs = require('fs');
var dataAms = JSON.parse(fs.readFileSync('data/amsterdam_data.json'));
var dataLines = JSON.parse(fs.readFileSync('data/stops_per_line.json'));

var glob = {}

dataAms.forEach(e => {
    var passes = Object.keys(e["Passes"]);
    passes.forEach(p => {
        var obj = e["Passes"][p];
        var operatorCode = obj["OperatorCode"];
        var lineCode = obj["LinePlanningNumber"];
        var transportType = obj["TransportType"];
        var stopCode = obj["TimingPointCode"];
        var orderNumber = obj["UserStopOrderNumber"];
        var newP = p.replace(/([A-Z]+)_\d+_([A-Za-z0-9]+)_\d+_\d+/g, "$1_$2");
        var numStops = dataLines[newP];
        var direction = obj["LineDirection"];

        if (!glob[operatorCode]) {
            glob[operatorCode] = {}
        }

        if (!glob[operatorCode][lineCode]) {
            glob[operatorCode][lineCode] = {
                "direction" : direction,
                "transportType" : transportType,
                "totalStops" : numStops ? numStops : -1,
                "stops" : []
            }
        }

        glob[operatorCode][lineCode]["stops"].push({
            stopCode: stopCode,
            orderNumber: orderNumber
        })
    })
})

fs.writeFileSync("data/route_data.json", JSON.stringify(glob))
console.log(JSON.stringify(glob));
