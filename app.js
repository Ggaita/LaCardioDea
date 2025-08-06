// app.js
import { initMap } from './map.js';
import { setupGeolocation } from './geo.js';
import { loadPoints } from './points.js';

document.addEventListener('DOMContentLoaded', () => {
  const map = initMap();
  setupGeolocation(map);
  loadPoints(map);
});
