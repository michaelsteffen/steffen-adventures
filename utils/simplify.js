/* Takes a complex geojson file, 
   throws out everything but LineStrings, 
   and then combines them into one big multilinestring */

'use strict';

if (process.argv.length !== 3) {
  console.error("Expected 1 argument. Received", process.argv.length-2, "arguments.");
	console.error("Usage: node add-drive start-lon start-lat end-lon end-lat description.");
  console.error(process.argv);
	process.exit(1);
}

var start = {x: process.argv[2], y: process.argv[3]}
var end = {x: process.argv[4], y: process.argv[5]}

var directionsRequest = 
      "http://api.tiles.mapbox.com/v4/directions/mapbox.driving/" + 
      start.x + "," + start.y + ";" +
      end.x + "," + end.y + ".json" +
      "?access_token=pk.eyJ1IjoibWFzMjIyIiwiYSI6Ikc2STF6MzAifQ.rRkEFqc17IcaQesSHxUV1w";

console.warn("Trying", directionsRequest, " . . .");

HTTP.get(directionsRequest, function(response) {
  response.setEncoding('utf8');

  var data = '';
  response.on('data', function(chunk) {
    data += chunk;
  });

  response.on('end', function() {
    data = JSON.parse(data);
    if (!data.routes || !data.routes[0].geometry) {
      console.log("unexpected response: ", data);
      process.exit(1);
    }  


    var outJSON = {
      "type":"Feature",
      "properties": {
        "type": "drive",
        "description": process.argv[6]
      },
      "geometry": {
        "type": data.routes[0].geometry.type,
        "coordinates": data.routes[0].geometry.coordinates
      }
    };
    console.log(JSON.stringify(outJSON));
  });
}).on('error', function(e) {
  console.log("Got error: ", e);
});



