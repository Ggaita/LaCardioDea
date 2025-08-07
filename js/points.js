/**
 * Módulo: points.js
 * Descripción: Se encarga de cargar puntos desde Google Sheets y mostrarlos en el mapa,
 *              así como de manejar la ubicación del usuario y calcular distancias.
 * Autor: Gonzalo Gaspar Gaita + IA (ChatGPT)
 */

import { drawRoute } from './routing.js'; 

let userLatLng = null; // Guarda la última ubicación conocida del usuario
const customIcon = L.icon({
  iconUrl: './icons/deaUbi.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

// Recibe la ubicación actual desde geo.js
export function setUserLocation(latlng) {
  userLatLng = latlng;
}

// Carga los puntos del servidor y los dibuja en el mapa
const geoJsonUrl = 'https://geoidelp.lapampa.gob.ar/geoserver/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=p_min_salud:Desfibriladores&outputFormat=application/json';

export async function loadPoints(map) {
  try {
    const response = await fetch(geoJsonUrl);
    const geojson = await response.json();

    geojson.features.forEach(feature => {
      const coords = feature.geometry.coordinates;
      const lat = coords[1];
      const lng = coords[0];

       // Crea marcador en el mapa
      const marker = L.marker([lat, lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(`
          <b>Institución:</b> ${feature.properties.Institucion || 'N/A'}<br>
          <b>Localidad:</b> ${feature.properties.Localidad || 'N/A'}<br>
          <b>Email:</b> ${feature.properties.Mail || 'N/A'}<br>
          <b>Teléfono:</b> ${feature.properties.Telefono || 'N/A'}<br>
          <b>Marca:</b> ${feature.properties.Marca || 'N/A'}<br>
          <b>Modelo:</b> ${feature.properties.Modelo || 'N/A'}<br>
          <b>N° Serie:</b> ${feature.properties.Nro_serie || 'N/A'}<br>
          <b>Instalado:</b> ${feature.properties.Fecha_instalacion || 'N/A'}<br>
          <b>Horario:</b> ${feature.properties.Horario || 'N/A'}
        `);

      marker.on('click', () => {
        if (!userLatLng) {
          alert('Ubicación del usuario no disponible');
          return;
        }
        drawRoute(map, userLatLng, [lat, lng]);
      });
    });

    // Ajusta la vista al primer punto
    if (geojson.features.length > 0) {
      const firstCoords = geojson.features[0].geometry.coordinates;
      map.setView([firstCoords[1], firstCoords[0]], 13);
    }

  } catch (error) {
    console.error('Error al cargar puntos:', error);
  }
}
