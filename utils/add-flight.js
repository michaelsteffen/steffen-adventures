'use strict';

var Arc = require('./arc');

if (process.argv.length !== 8) {
	console.error("Expected 6 arguments. Received", process.argv.length-1, "arguments.");
	console.error("Usage: node add-flight start-lon start-lat end-lon end-lat num-steps date description.");
	process.exit(1);
}

var start = {x: process.argv[2], y: process.argv[3]}
var end = {x: process.argv[4], y: process.argv[5]}

var myGreatCircle = new Arc.GreatCircle(start, end);
var myArc = myGreatCircle.Arc(process.argv[6], {});

var outJSON = {
  "type":"Feature",
  "properties": {
    "type": "flight",
    "description": process.argv[7]
  },
  "geometry": {
    "type": myArc.json().geometry.type,
    "coordinates":myArc.json().geometry.coordinates }
}

console.log(JSON.stringify(outJSON));