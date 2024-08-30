// Initialize OlaMaps with your API key
const olaMaps = new OlaMapsSDK.OlaMaps({
    apiKey: 'P2S8ORVt4FrFNahpWTqaMhQTaNx6hI7AE2RiVdAg', // Replace with your actual API key
});

// Initialize the map
const myMap = olaMaps.init({
    style: "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json", // URL for map style
    container: 'map', // ID of the map container
    center: [80.237617, 13.067439], // Latitude and Longitude
    zoom: 15, // Zoom level
});

// Create a custom marker class
function createCustomMarker(lngLat) {
    const customMarkerClass = document.createElement('div');
    customMarkerClass.classList.add('customMarkerClass');

    // Add a draggable marker with custom image
    const marker = olaMaps
        .addMarker({
            element: customMarkerClass, // Use custom image
            offset: [0, 0], // Adjust if needed
            anchor: 'bottom', // Anchor position
            draggable: true // Make the marker draggable
        })
        .setLngLat(lngLat) // Set initial position
        .addTo(myMap);

    // Add an info window
    const popup = olaMaps
        .addPopup({ offset: [0, -30], anchor: 'bottom' })
        .setHTML(`<div>Current Position: ${lngLat[1].toFixed(4)}, ${lngLat[0].toFixed(4)}</div>`); // Info window content

    marker.setPopup(popup);

    // Function to update position in info window on drag
    function onDrag() {
        const updatedLngLat = marker.getLngLat();
        popup.setHTML(`<div>Current Position: ${updatedLngLat[1].toFixed(4)}, ${updatedLngLat[0].toFixed(4)}</div>`);
    }

    // Attach the drag event
    marker.on('drag', onDrag);
}

// Function to perform geocoding using Nominatim API
function geocode(query) {
    return fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
        .then(response => response.json());
}

// Handle search functionality
document.getElementById('search-button').addEventListener('click', function () {
    const query = document.getElementById('search-input').value;

    geocode(query)
        .then(locations => {
            if (locations && locations.length > 0) {
                // Clear existing markers
                myMap.getMarkers().forEach(marker => marker.remove());

                // Add markers for each matching location
                locations.forEach(location => {
                    const coordinates = [parseFloat(location.lon), parseFloat(location.lat)];
                    createCustomMarker(coordinates);
                });

                // Adjust map view to fit all markers
                const bounds = locations.map(location => [parseFloat(location.lon), parseFloat(location.lat)]);
                myMap.fitBounds(bounds, { padding: 50 });
            } else {
                alert('No matching locations found');
            }
        })
        .catch(error => {
            alert('Error fetching location data');
        });
});
    