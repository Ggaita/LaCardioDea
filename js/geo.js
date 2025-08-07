/**
 * Módulo: geo.js
 * Descripción: Se encarga de obtener y actualizar la ubicación del usuario en el mapa.
 * Autor: Gonzalo Gaspar Gaita
 * Fecha: 2025
 */


import { setUserLocation } from './points.js';

let userMarker = null;
let hasCentered = false; // Solo centrar el mapa una vez al inicio

// Función para iniciar la geolocalización del usuario

export function setupGeolocation(map) {
  // Verifica si el navegador soporta geolocalización
  if (!navigator.geolocation) {
    alert('Geolocalización no disponible');
    return;
  }

  // Utiliza watchPosition para seguir actualizando la posición
  function updatePosition() {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        const latlng = [latitude, longitude];

         // Si el marcador ya existe, lo mueve. Si no, lo crea.
        if (userMarker) {
          userMarker.setLatLng(latlng);
        } else {
          userMarker = L.marker(latlng).addTo(map).bindPopup('Tu ubicación').openPopup();
        }

        // Solo centra el mapa en la primera detección de posición
        if (!hasCentered) {
          map.setView(latlng, 17); // Zoom el que quieras
          hasCentered = true;
        }

        // Envía la posición actual al resto del sistema
        setUserLocation(latlng);
      },
      error => {
        console.error('Error de geolocalización:', error);
      },
      {
        enableHighAccuracy: true, // Precisión máxima
        timeout: 5000,  // Tiempo máximo de espera
        maximumAge: 0   // No usar posiciones en caché
      }
    );
  }

  updatePosition(); // Primera llamada inmediata
  setInterval(updatePosition, 3000); // Cada 3 segundos
}


