(function() {
  'use strict';

  app.map.buildMap = buildMap;
  
  function buildMap() {

    if (!mapboxgl.supported()) {
      $(rideMap.containerDiv).addClass('not-supported');
      return;
    }

    mapboxgl.util.getJSON(app.styleFile, function (err, style) {
      if (err) throw err;
  
      // init the map
      app.map = new mapboxgl.Map({
        container: app.mapDiv,
        style: style,
        center: [1.0, 169.0],
        zoom: 1.6,
        hash: true
      });

      // zoom to a reasonable location

      // add and tweak the controls
      app.map.addControl(new mapboxgl.Navigation({position: 'top-left'}));
      $('.mapboxgl-ctrl-compass').remove();

      // set up hover and click behaviors
      app.map.on('style.load', function() {
        app.map.highlighted = false;

        // add highlight layers
        app.locations.features.forEach(function(postFeature) {
          // basic layer properties. . .
          var highlightLayer = {
            "id": postFeature.properties.id + "-highlight",
            "type": "symbol",
            "source": "post-locations",
            "filter": ["==", "id", postFeature.properties.id],
            "layout": {
              "icon-image": "blog-entry-highlighted",
              "icon-allow-overlap": true,
              "text-field": "{date}: {title}",
              "text-allow-overlap": true,
              "text-font": "DIN Offc Pro Bold, Arial Unicode MS Regular",
              "text-offset": [0, 1.4],
              "text-anchor": "top",
              "visibility": "none"
            },
            "paint": {
              "text-size": 12,
              "text-color": "#0085a1",
              "text-halo-color": "white",
              "text-halo-width": 1,
            }
          }

          //add layer to the map
          app.map.addLayer(highlightLayer);
        });

        app.map.on('mousemove', function(e) {
          app.map.featuresAt(e.point, {radius: 12, includeGeometry: true}, function(err, features) {
            if (err) throw err;
            if (features.length) {
              app.map.setLayoutProperty(features[0].properties.id + "-highlight", "visibility", "visible");
              app.map.highlighted = features[0].properties.id + "-highlight";
              $('.mapboxgl-canvas').css('cursor','pointer');
            } else if (app.map.highlighted !== false) {
              app.map.setLayoutProperty(app.map.highlighted, "visibility", "none");
              app.map.highlighted = false;
              $('.mapboxgl-canvas').css('cursor','');
            }
          });
        });

        app.map.on('click', function(e) {
          app.map.featuresAt(e.point, {radius: 12}, function(err, features) {
            if (err) throw err;
            if (features.length) window.location.href = features[0].properties.url;
          });
        });
      });
    });
  }

  /*
  function _onHover(event) {
    rideMap.map.featuresAt(event.point, {radius:5}, function(err, features) {
      if (err) throw err;
      
      var activeFeatures = [];
      var style = rideMap.map.style;
      for (var i=0; i<features.length; i++) {
        var feature = features[i];
        if (style.hasClass(feature.properties.name + '_active')) {
          activeFeatures.push(feature.properties.name);
        }
      }
      
      var change = !(JSON.stringify(activeFeatures) === JSON.stringify(lastFeatures));
      lastFeatures = activeFeatures;
      if (!change) {
        return;
      } else if (activeFeatures.length == 0) {
        _rideOnMouseLeave(activeFeatures);
      } else {
        _rideOnMouseEnter(activeFeatures);
      }
    });
  }
  
  function _rideOnMouseEnter(rideNames) {
    _setHighlight(rideNames);
  }
  
  function _rideOnMouseLeave(rideNames) {
    _setHighlight([]);
  }
  
  function _setHighlight(rideNames) {
    var map = rideMap.map;
    var classes = map.style.getClassList(); 
    var newClasses = rideNames.map(function(e) { return e + '_highlight' });
    classes = classes.filter(function(e) { return e.slice(-10) !== '_highlight' });
    classes = classes.concat(newClasses);
    map.style.setClassList(classes);
  } 
  */
})(); 
