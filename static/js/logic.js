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


    function styleSheet(feature) {
        return{
            fillColor:'black'
        }
    }
    // Loop through each feature (earthquake) in the GeoJSON data.
    data.features.forEach(function (feature) {
        // Get the coordinates and properties of the earthquake.
        var lat = feature.geometry.coordinates[1];
        var lng = feature.geometry.coordinates[0];
        var properties = feature.properties;

        // Create a marker at the coordinates of the earthquake.
        var marker = L.circleMarker([lat, lng])
            .bindPopup(`<h3>${properties.place}</h3><hr><p>${new Date(properties.time)}</p>`)
            .addTo(myMap);
    });

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
    
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 10, 20, 50, 100, 200, 500, 1000],
            labels = [];
    
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
    
        return div;
    };
    
    legend.addTo(mymap);






});
  
