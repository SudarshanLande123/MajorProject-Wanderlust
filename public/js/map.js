// public/js/map.js 
const key = window.maptilerKey;
const mapDiv = document.getElementById('map');

if (!key) console.error("MapTiler key missing!");
if (!mapDiv.dataset.lng || !mapDiv.dataset.lat) {
    console.error("Missing coordinates!");
}

const lng = Number(mapDiv.dataset.lng) || 7.2;
const lat = Number(mapDiv.dataset.lat) || 46.1;
const title = mapDiv.dataset.title || "Hotel";
const placeLocation = mapDiv.dataset.location || "Unknown";

const map = new maplibregl.Map({
    container: 'map',
    style: `https://api.maptiler.com/maps/outdoor/style.json?key=${key}`,
    center: [lng, lat],
    zoom: 10
});

new maplibregl.Marker({ color: "#c00" })
    .setLngLat([lng, lat])
    .setPopup(new maplibregl.Popup({ offset: 25 })
        .setHTML(`<h6>${title}</h6><p>${placeLocation}</p>`))
    .addTo(map);

map.addControl(new maplibregl.NavigationControl());