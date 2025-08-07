/**
 * Módulo: routing.js
 * Descripción: Se encarga de hacer las rutas...
 * Autor: Gonzalo Gaspar Gaita
 * Fecha: 2025
 */


// Controlar si ya hay una ruta dibujada en el mapa
let routeControl = null;

// Dibuja una ruta entre el punto de inicio y el punto final
export function drawRoute(map, start, end) {
  // Si ya hay una ruta dibujada, se remueve del mapa para evitar superposición
  if (routeControl) {
    map.removeControl(routeControl);
  }

  // Se crea un nuevo control de ruta usando Leaflet Routing Machine
  routeControl = L.Routing.control({
    // Definimos los puntos de inicio y fin como waypoints
    waypoints: [
      L.latLng(start[0], start[1]), // Punto de inicio (latitud, longitud)
      L.latLng(end[0], end[1])  // Punto de destino (latitud, longitud)
    ],
    // Configuramos el router con el servicio OSRM (Open Source Routing Machine)
    router: L.Routing.osrmv1({
      serviceUrl: 'https://router.project-osrm.org/route/v1', // URL del servidor OSRM
      profile: 'foot', // Tipo de perfil: 'foot' indica que es una ruta peatonal
    }),
    // Opciones visuales para la línea de la ruta
    lineOptions: {
      styles: [{ color: 'blue', weight: 4 }], // Color azul y grosor de línea 4
      addWaypoints: false, // No se permite al usuario añadir puntos intermedios
      extendToWaypoints: true, // Extiende la línea exactamente hasta los puntos indicados
      missingRouteTolerance: 10 // Tolerancia en caso de que no se encuentre una ruta exacta
    },

    // No se crean marcadores en los puntos de inicio y fin
    createMarker: () => null,
    show: false, // Se desactiva el panel de instrucciones
    addWaypoints: false, // También se desactiva la posibilidad de agregar nuevos puntos
    routeWhileDragging: false, // La ruta no se recalcula mientras se arrastra
    fitSelectedRoutes: true // Ajusta automáticamente el mapa para mostrar la ruta completa
  }).addTo(map); // Agrega el control de ruta al mapa
}
