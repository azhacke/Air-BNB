// const { off } = require("../../models/review");

mapboxgl.accessToken = mapToken;

// let centerCoords = [78.0486, 15.8338];
// try {
//     if (typeof coordinates !== 'undefined' && coordinates !== null) {
//         if (typeof coordinates === 'string') {
//             centerCoords = JSON.parse(coordinates);
//         } else if (Array.isArray(coordinates)) {
//             centerCoords = coordinates;
//         }
//     }
// } catch (err) {
//     console.error('Error parsing coordinates:', err);
// }

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    projection: 'globe',
    zoom: 12,
    center: listing.geometry.coordinates
});

const marker = new mapboxgl.Marker({ color: 'red' })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25}).setHTML(
            `<h4>${listing.title}</h4><p> Exact location provided after booking: ${listing.location} <p/>`
        )
    )
    .addTo(map);