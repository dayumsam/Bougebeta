var coordinatesLL = [];
var lineCoordinatesRecieve = [];
var lineCoordinatesSend = [];
var idR;
var idS;

var marker = new mapboxgl.Marker();

var url = "http://localhost:3000/coordinates";


var lineDataS  = {
    "id": idR,
    "type": "line",
    "source": {
        "type": "geojson",
        "data": {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "LineString",
                "coordinates": [[2.335466,48.866902],[2.352595, 48.866169],[2.352074,48.851803], [2.333906, 48.851599],[2.335466,48.866902]]
            }
        }
    },
    "layout": {
        "line-cap": "round"
    },
    "paint": {
        "line-color": "#888",
        "line-width": 8
    }
}

mapboxgl.accessToken = 'pk.eyJ1IjoiZGF5dW1zYW0iLCJhIjoiY2p5NmJuOGU4MGZnMDNjbXM0NWJuMHV1cSJ9.-hIDDVYF-qGs9ZHy1kNn1w';

var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/dark-v10', // stylesheet location
    center: [2.3629213, 48.852968399999995], // starting position [lng, lat]
    zoom: 17 // starting zoom
})


function updateLocation() {
    navigator.geolocation.getCurrentPosition(function (position) {
        coordinatesLL = [position.coords.longitude, position.coords.latitude];
        lineCoordinatesSend.push(coordinatesLL);
        //console.log(lineDataS.source.data.geometry.coordinates)
        marker.setLngLat(coordinatesLL).addTo(map)
    });
}


axios.post('/coordinates', {
    coordinates: lineDataS.source.data.geometry.coordinates
    })
    .then(function (response) {
    console.log(response);
    })
    .catch(function (error) {
    console.log(error);
    });


    // axios.get(url)
    // .then(function (response) {
    //     lineCoordinatesRecieve = JSON.parse(response.data["0"].coordinates.toString().replace(/\n/g, '')).coordinates;     
    // })

map.on('load', function () {
    // id = navigator.geolocation.watchPosition(success, error, options);
    navigator.geolocation.getCurrentPosition(function (position) {
        coordinatesLL = [position.coords.longitude, position.coords.latitude];
        map.flyTo({
            center: coordinatesLL
        });
    });

    var lineDataR  = {
        "id": "route",
        "type": "line",
        "source": {
            "type": "geojson",
            "data": {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": lineCoordinatesRecieve
                }
            }
        },
        "layout": {
            "line-cap": "round"
        },
        "paint": {
            "line-color": "#888",
            "line-width": 8
        }
    }

    map.addLayer(lineDataR)
});

window.setInterval(updateLocation, 1000);