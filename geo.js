// geo.js
import { setUserLocation } from './points.js';

let userMarker = null;
let hasCentered = false; // ✅ solo acercar la primera vez

export function setupGeolocation(map) {
  if (!navigator.geolocation) {
    alert('Geolocalización no disponible');
    return;
  }

  function updatePosition() {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        const latlng = [latitude, longitude];

        // 🧍‍♂️ Colocar o mover marcador de usuario
        if (userMarker) {
          userMarker.setLatLng(latlng);
        } else {
          userMarker = L.marker(latlng).addTo(map).bindPopup('Tu ubicación').openPopup();
        }

        // 🎯 Solo acercar y centrar una vez (cuando aún no se centró)
        if (!hasCentered) {
          map.setView(latlng, 17); // Zoom 17 o el que quieras
          hasCentered = true;
        }

        // 📤 Enviar la ubicación al resto del sistema
        setUserLocation(latlng);
      },
      error => {
        console.error('Error de geolocalización:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  }

  updatePosition(); // Primera llamada inmediata
  setInterval(updatePosition, 3000); // Cada 3 segundos
}


