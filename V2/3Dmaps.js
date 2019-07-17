
var coordinates = [
    -74.0066,
    40.7135
];

var sizePointer = 100;

mapboxgl.accessToken = 'pk.eyJ1IjoiZGF5dW1zYW0iLCJhIjoiY2p5NmJuOGU4MGZnMDNjbXM0NWJuMHV1cSJ9.-hIDDVYF-qGs9ZHy1kNn1w';
var map = new mapboxgl.Map({
    style: 'mapbox://styles/mapbox/dark-v9',
    center: [-74.0066, 40.7135],
    zoom: 15.5,
    pitch: 45,
    bearing: -17.6,
    container: 'map',
    antialias: true
});


function onLocationFound(e) {
    L.marker(e.latlng, { icon: marker1 }).addTo(map)
}

function onLocationError(e) {
    alert(e.message);
}

function updateLocation() {
    navigator.geolocation.getCurrentPosition(function (position) {

        coordinates = [position.coords.latitude, position.coords.longitude];
    });
    map.flyTo({center: coordinates});
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

// The 'building' layer in the mapbox-streets vector source contains building-height
// data from OpenStreetMap.

var pulsingDot = {
    width: sizePointer,
    height: sizePointer,
    data: new Uint8Array(sizePointer * sizePointer * 4),

    onAdd: function () {
        var canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext('2d');
    },

    render: function () {
        var duration = 1000;
        var t = (performance.now() % duration) / duration;

        var radius = sizePointer / 2 * 0.3;
        var outerRadius = sizePointer / 2 * 0.7 * t + radius;
        var context = this.context;

        // draw outer circle
        context.clearRect(0, 0, this.width, this.height);
        context.beginPath();
        context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
        context.fillStyle = 'rgba(255, 200, 200,' + (1 - t) + ')';
        context.fill();

        // draw inner circle
        context.beginPath();
        context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
        context.fillStyle = 'rgba(255, 100, 100, 1)';
        context.strokeStyle = 'white';
        context.lineWidth = 2 + 4 * (1 - t);
        context.fill();
        context.stroke();

        // update this image's data with data from the canvas
        this.data = context.getImageData(0, 0, this.width, this.height).data;

        // keep the map repainting
        map.triggerRepaint();

        // return `true` to let the map know that the image was updated
        return true;
    }
};

map.addControl(new mapboxgl.NavigationControl());

map.on('load', function () {

    // Insert the layer beneath any symbol layer.

    var layers = map.getStyle().layers;

    var labelLayerId;
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
            labelLayerId = layers[i].id;
            break;
        }
    }

    map.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
            'fill-extrusion-color': 'red',

            // use an 'interpolate' expression to add a smooth transition effect to the
            // buildings as the user zooms in

            'fill-extrusion-height': [
                "interpolate", ["linear"], ["zoom"],
                15, 0,
                15.05, ["get", "height"]
            ],
            'fill-extrusion-base': [
                "interpolate", ["linear"], ["zoom"],
                15, 0,
                15.05, ["get", "min_height"]
            ],
            'fill-extrusion-opacity': .6
        }
    }, labelLayerId);

    map.addLayer({
        "id": "points",
        "type": "symbol",
        "source": {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": [{
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": coordinates
                    }
                }]
            }
        },
        "layout": {
            "icon-image": "pulsing-dot"
        }
    });

    map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });

    window.setInterval(updateLocation, 5000);

});