/* 

Takes a geojson file that is a MultiLineString, and links each component linestring
end-to-end as best we can based on the specified tolerance (in fractional degrees)
Works best if run multiple times with successively increasing tolerances (starting with tolerance=0)
  
*/

'use strict';
var fs = require('fs');

if (process.argv.length !== 4) {
  console.error("Expected 2 arguments. Received", process.argv.length-2, "arguments.");
	console.error("Usage: node combine infile tolerance.");
  console.error(process.argv);
	process.exit(1);
}

var file = __dirname + '/' + process.argv[2];
var tolerance = process.argv[3];
var toleranceSquared = Math.pow(tolerance,2);

// read infile
var feature = JSON.parse(fs.readFileSync(file, 'utf8'));
var coords = feature.geometry.coordinates;

// Generate array of start points 

var startPoints = [];
var endPoints = [];
if (feature.geometry.type !== "MultiLineString") {
  console.error("Infile must be a MultiLineString.");
  process.exit(1);
}

coords.forEach(function (lineString) {
  startPoints.push(lineString[0]);
  endPoints.push(lineString[lineString.length-1]);
});


// For each linestring, see if there is a start point within the tolerance distance
// of its current endpoint. If so, concatenate the linestrings and repeat 

var origSegments = coords.length;

var i = 0;
while (i < coords.length) {
  var endPoint = endPoints[i];
  var startPoint = startPoints[i];
  var match = false;

  for (var j=0; j < coords.length; j++) {
    if (j === i) continue;
    var compareStartPoint = startPoints[j]; 
    var compareEndPoint = endPoints[j];
    var endStartMatch = (Math.pow(endPoint[0]-compareStartPoint[0],2) + Math.pow(endPoint[1]-compareStartPoint[1],2)) <= toleranceSquared;
    var endEndMatch = (Math.pow(endPoint[0]-compareEndPoint[0],2) + Math.pow(endPoint[1]-compareEndPoint[1],2)) <= toleranceSquared;
    var startStartMatch = (Math.pow(startPoint[0]-compareStartPoint[0],2) + Math.pow(startPoint[1]-compareStartPoint[1],2)) <= toleranceSquared;

    if (endStartMatch || endEndMatch || startStartMatch) {
        match = true;
        if (endStartMatch) {
          coords[i] = coords[i].concat(coords[j]);
          endPoints[i] = endPoints[j];
        } else if (endEndMatch) {
          coords[i] = coords[i].concat(reverse(coords[j]));
          endPoints[i] = startPoints[j];
        } else if (startStartMatch) {
          coords[i] = reverse(coords[i]).concat(coords[j]);
          startPoints[i] = endPoints[i];
          endPoints[i] = endPoints[j];
        }
        coords.splice(j,1);
        startPoints.splice(j,1);
        endPoints.splice(j,1);
        break;
    }
  }
  if (!match) i++;
}

console.log(JSON.stringify(feature));

console.warn("Reduced " + origSegments + " segments to " + coords.length + " segments");
console.warn(startPoints);
console.warn(endPoints);

function reverse(lineString) {
  var newLineString = [];
  for (var k=0; k < lineString.length; k++) {
    newLineString[k] = lineString[lineString.length-k-1];
  }
  return newLineString;
}





