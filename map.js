// map.js
export function initMap() {
  const map = L.map("map").setView([-36.82, -65.48], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);

  return map;
}


export function centerMap(lat, lon, zoom = initialZoom) {
    map.setView([lat, lon], zoom);
}