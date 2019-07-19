var coordinates = [];

var lineCoordinates = [];

var id, options;

var marker = new mapboxgl.Marker();

var url = "http://localhost:3000/coordinates";

mapboxgl.accessToken = 'pk.eyJ1IjoiZGF5dW1zYW0iLCJhIjoiY2p5NmJuOGU4MGZnMDNjbXM0NWJuMHV1cSJ9.-hIDDVYF-qGs9ZHy1kNn1w';

var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/dark-v10', // stylesheet location
    center: [2.3629213, 48.852968399999995], // starting position [lng, lat]
    zoom: 17 // starting zoom
})

// function success(position) {
//     coordinates = [position.coords.longitude, position.coords.latitude];
//     console.log(coordinates);
//     marker.setLngLat(coordinates).addTo(map)
//     //navigator.geolocation.clearWatch(id);
//   }

// function error(err) {
//   console.warn('ERROR(' + err.code + '): ' + err.message);
// }

// function stopWatch() 
// {
//   navigator.geolocation.clearWatch(watchID);
// }

// options = {
//   enableHighAccuracy: true,
//   maximumAge: 0
// };

function updateLocation() {
    navigator.geolocation.getCurrentPosition(function (position) {
        coordinates = [position.coords.longitude, position.coords.latitude];
        marker.setLngLat(coordinates).addTo(map)
    });
}

axios.get(url)
.then(function (response) {
    lineCoordinates = response.data["0"].coordinates;
    console.log(lineCoordinates);
    //lineCoordinates = JSON.parse(response.toString().replace(/\n/g, ''));
  })

map.on('load', function() {
    // id = navigator.geolocation.watchPosition(success, error, options);

    navigator.geolocation.getCurrentPosition(function (position) {
        coordinates = [position.coords.longitude, position.coords.latitude];
    map.flyTo({
        center: coordinates});
    });
});

window.setInterval(updateLocation, 1000);