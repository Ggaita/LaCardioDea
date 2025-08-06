// routing.js
let routeControl = null;

export function drawRoute(map, start, end) {
  if (routeControl) {
    map.removeControl(routeControl);
  }

  routeControl = L.Routing.control({
    waypoints: [
      L.latLng(start[0], start[1]),
      L.latLng(end[0], end[1])
    ],
    router: L.Routing.osrmv1({
      serviceUrl: 'https://router.project-osrm.org/route/v1',
      profile: 'foot',
    }),
    lineOptions: {
      styles: [{ color: 'blue', weight: 4 }],
      addWaypoints: false,
      extendToWaypoints: true,
      missingRouteTolerance: 10
    },
    createMarker: () => null,
    show: false, // oculta el panel de instrucciones
    addWaypoints: false,
    routeWhileDragging: false,
    fitSelectedRoutes: true
  }).addTo(map);
}
