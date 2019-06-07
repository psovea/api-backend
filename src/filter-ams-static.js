/*
 * NIET MEER NODIG
 */

const fs = require('fs');

/* The timepoins are split up in 200 separate objects, so we want to flatten
 * out this object.
 */
var flatten = (obj) => {
  var flatObj = [];

  for (var i in obj) {
    /* Some indices do not contain any objects (for some reason we do not know),
     * so we have to catch eventual TypeErrors.
     */
    try {
      var keys = Object.keys(obj[i]);

      keys.forEach(key => {
        flatObj.push(obj[i][key]);
      })
    } catch(e) {
      continue;
    }
  }

  return flatObj;
}

var main = () => {
  var timepoints = flatten(JSON.parse(fs.readFileSync('data/timepoint_data.json')));
  var amsterdamTimepoints = [];

  /* Filter out all timepoints that are located in Amsterdam. */
  timepoints.forEach(key => {
    if (key.Stop.TimingPointTown.toLowerCase() == 'amsterdam') {
      amsterdamTimepoints.push(key);
    }
  })

  fs.writeFileSync("data/amsterdam_data.json", JSON.stringify(amsterdamTimepoints));
}

main();
