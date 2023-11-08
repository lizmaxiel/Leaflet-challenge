// Define the URL of the JSON data
const jsonURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Create a Leaflet map
const map = L.map('map').setView([0, 0], 2);

// Add a base layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to fetch and display the JSON data
function fetchDataAndDisplay() {
    // Fetch the JSON data
    fetch(jsonURL)
        .then(response => response.json())
        .then(data => {
            // Access and manipulate the data
            addEarthquakeMarkers(data);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}

// Function to add markers for each earthquake to the map
function addEarthquakeMarkers(data) {
    data.features.forEach(feature => {
        const coordinates = feature.geometry.coordinates;
        const magnitude = feature.properties.mag;
        const depth = coordinates[2];
        const title = feature.properties.title;

        // Determine the depth class
        let depthClass = '';
        if (depth <= 10) {
            depthClass = 'shallow';
        } else if (depth <= 30) {
            depthClass = 'intermediate';
        } else if (depth <= 50) {
            depthClass = 'moderate';
        } else if (depth <= 70) {
            depthClass = 'deep';
        } else {
            depthClass = 'very-deep';
        }

        const radius = getRadius(magnitude);
        const color = getColor(depth);

        // Create a circle marker with custom styling
        L.circle([coordinates[1], coordinates[0]], {
            radius: radius,
            color: 'black',
            fillColor: color,
            fillOpacity: 10
        }).addTo(map).bindPopup(
            `Magnitude: ${magnitude}<br>Depth: ${depth} km`
        );
    });
}

// Function to determine the radius (size) of the marker based on magnitude
function getRadius(magnitude) {
    // Scale the radius based on magnitude
    return magnitude * 50000;
}

// Function to determine the color of the marker based on depth
function getColor(depth) {
    if (depth <= 10) {
        return 'green';
    } else if (depth <= 30) {
        return 'yellow';
    } else if (depth <= 50) {
        return 'orange';
    } else if (depth <= 70) {
        return 'red';
    } else {
        return 'darkred';
    }
}

// Call the fetchDataAndDisplay function when the page loads
fetchDataAndDisplay();
