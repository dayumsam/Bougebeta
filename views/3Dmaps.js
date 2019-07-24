var coordinatesLL = [];
var lineCoordinatesRecieve = [];
var lineCoordinatesSend = [];
var locateButtonFlag = 2;
var getLines = "";
var idR;

var marker = new mapboxgl.Marker();

var urlCoordinates = "http://localhost:3000/coordinates";
var urlID = "http://localhost:3000/polygonID";

var lineDataS = {
  id: idR,
  type: "line",
  source: {
    type: "geojson",
    data: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: lineCoordinatesSend
      }
    }
  },
  layout: {
    "line-cap": "round"
  },
  paint: {
    "line-color": "#888",
    "line-width": 8
  }
};

mapboxgl.accessToken =
  "pk.eyJ1IjoiZGF5dW1zYW0iLCJhIjoiY2p5NmJuOGU4MGZnMDNjbXM0NWJuMHV1cSJ9.-hIDDVYF-qGs9ZHy1kNn1w";

var map = new mapboxgl.Map({
  container: "map", // container id
  style: "mapbox://styles/mapbox/dark-v10", // stylesheet location
  center: [2.3629213, 48.852968399999995], // starting position [lng, lat]
  zoom: 17 // starting zoom
});

function updateLocation() {
  navigator.geolocation.getCurrentPosition(function(position) {
    coordinatesLL = [position.coords.longitude, position.coords.latitude];
    //lineCoordinatesSend.push(coordinatesLL);
    //console.log(lineDataS.source.data.geometry.coordinates)
    marker.setLngLat(coordinatesLL).addTo(map);
  });
}

function buttonClick() {
  if (locateButtonFlag !== 1) {
    locateButtonFlag = 1;
  } else if (locateButtonFlag == 1) {
    locateButtonFlag = 0;
  }
}

function getLocationPushed() {
  console.log("getting location");
  navigator.geolocation.getCurrentPosition(function(position) {
    coordinatesLL = [position.coords.longitude, position.coords.latitude];
    lineCoordinatesSend.push(coordinatesLL);
  });
}

function startTrack() {
  if (locateButtonFlag == 1) {
    var buttons = document.getElementById("startButton");
    buttons.innerHTML = '<img src="startButton2.png" style="width:75px;height:75px;"/>';
    navigator.geolocation.getCurrentPosition(function(position) {
        coordinatesLL = [position.coords.longitude, position.coords.latitude];
        lineCoordinatesSend.push(coordinatesLL);})
  }

    else if (locateButtonFlag == 0) {
    var buttons = document.getElementById("startButton");
    buttons.innerHTML ='<img src="startButton.png" style="width:75px;height:75px;"/>';

    axios
      .post("/coordinates", {
        coordinates: lineDataS.source.data.geometry.coordinates
      })
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
    lineDataS.source.data.geometry.coordinates = [];
    locateButtonFlag = 2;
  }

  else{}
}

// axios.post('/coordinates', {
//     coordinates: lineDataS.source.data.geometry.coordinates
//     })
//     .then(function (response) {
//     console.log(response);
//     })
//     .catch(function (error) {
//     console.log(error);
//     });

map.on("load", function getPolygons() {
  navigator.geolocation.getCurrentPosition(function(position) {
    coordinatesLL = [position.coords.longitude, position.coords.latitude];
    map.flyTo({
      center: coordinatesLL
    });

    console.log("getting polygons");
    axios.get(urlID).then(function(response) {
      var polygonCounter = response.data["0"].id;
      var newLayerID = ""; //paste here
      var lineCoordinatesRecieveParsed = [];

      axios.get(urlCoordinates).then(function(response) {
        lineCoordinatesRecieve = response.data;

        for (var count = 0; count < polygonCounter; count++) {
          var countString = count.toString();
          lineCoordinatesRecieveParsed = JSON.parse(
            lineCoordinatesRecieve[countString].coordinates
              .toString()
              .replace(/\n/g, "")
          ).coordinates;
          console.log(lineCoordinatesRecieveParsed);

          getLines = {
            id: countString,
            type: "line",
            source: {
              type: "geojson",
              data: {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "Polygon",
                  coordinates: lineCoordinatesRecieveParsed
                }
              }
            },
            layout: {
              "line-cap": "round"
            },
            paint: {
              "line-color": "#888",
              "line-width": 8
            }
          };
          map.addLayer(getLines);
        } //for
      });
    });

    window.setInterval(updateLocation, 1000);
    window.setInterval(startTrack, 500);
    
  });
});
