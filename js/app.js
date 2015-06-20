---
---

var app = {
  locations: {},
  mapDiv: "map",
  locationFile: "{{ site.baseurl }}/post-locations.geojson",
  styleFile: "{{ site.baseurl }}/map-style.json",
  map: {},
  locations: {}
};

mapboxgl.accessToken = 'pk.eyJ1IjoibWFzMjIyIiwiYSI6Ikc2STF6MzAifQ.rRkEFqc17IcaQesSHxUV1w';

(function() {
  'use strict';
  app.bootstrap = bootstrap;

  function bootstrap() {    
    _getLocations( function() {
      app.map.buildMap();
    } );
  }
  
  function _getLocations(callback) {
    callback();
    
    /* mapboxgl.util.getJSON(app.locationFile, function (err, data) {
      if (err) throw err;
      app.locations = data;      
      callback();
    }); */
  }
})();