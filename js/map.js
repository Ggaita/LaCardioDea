/**
 * Módulo: map.js
 * Descripción: Inicializa el mapa Leaflet con configuración básica y capas.
 * Y permite obtener la referencia al objeto del mapa para otros módulos.
 * Autor: Gonzalo Gaspar Gaita
 * Fecha: 2025
 */


// Función para inicializar y configurar el mapa

export function initMap() {
   // Crear el objeto del mapa centrado en una posición base (La Pampa)
  const map = L.map("map").setView([-36.82, -65.48], 13); // Coordenadas iniciales

  // Agregar capa de mapa base (OpenStreetMap)
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);

  return map;
}


export function centerMap(lat, lon, zoom = initialZoom) {
    map.setView([lat, lon], zoom);
}