/* 

Takes a Geojson file, throws out everything but LineStrings, 
and then combines them into one big MultiLineString.

*/

'use strict';
var fs = require('fs');

if (process.argv.length !== 3) {
  console.error("Expected 1 argument. Received", process.argv.length-2, "arguments.");
	console.error("Usage: node simplify infile.");
  console.error(process.argv);
	process.exit(1);
}

var file = __dirname + '/' + process.argv[2];
var inJSON = JSON.parse(fs.readFileSync(file, 'utf8'));

var outJSON = {
  "type":"Feature",
  "properties": {
    "type": "",
    "description": ""
  },
  "geometry": {
    "type": "MultiLineString",
    "coordinates": []
  }
};

inJSON.features.forEach(function (feature) {
  if (feature.geometry.type !== "LineString") return;
  outJSON.geometry.coordinates.push(feature.geometry.coordinates);
});

console.log(JSON.stringify(outJSON));





