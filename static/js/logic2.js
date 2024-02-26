// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// Create a map object.
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
});
// Create the base layers.
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);
// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    function styleInfo(features) {
        return {
            color: "#000000",
            fillColor: getcolor(features.geometry.coordinates[2]),
            radius: getradius(features.properties.mag),
            stroke: true,
            weight: 0.5,
            opacity: 1,
            fillOpacity: 1
        };
    }
    function getcolor(coordinate) {
        switch (true) {
            case coordinate > 90:
                return "#f09999";
            case coordinate > 70:
                return "#e8b387";
            case coordinate > 50:
                return "#edcc8c";
            case coordinate > 30:
                return "#f0e28d";
            case coordinate > 10:
                return "#d2db8a";
            default:
                return "#bad984";
        }
    }
    function getradius(size) {
        if (size === 0) {
            return 1;
        }
        return size * 4;
    }

    function onEachFeature(feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag
            + "<br>Location: " + feature.properties.place
            + "<br>Coordinates: " + feature.geometry.coordinates[2]);
    }
    L.geoJson(data, {
        pointToLayer: function (features, latlng) {
            return L.circleMarker(latlng);
        },
        style: styleInfo,
        onEachFeature: onEachFeature  // Corrected function name
    }).addTo(myMap);
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend");
        var grades = [-10, 10, 30, 50, 70, 90];
        var colors = [
            "#bad984",
            "#d2db8a",
            "#edcc8c",
            "#ee9c00",
            "#e8b387",
            "#f09999"
        ];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
                + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }
        return div;
    }
    legend.addTo(myMap);
});


legend.addTo(myMap);





