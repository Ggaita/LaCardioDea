/*<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ubicación en tiempo real</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <style>
        #map { height: 600px; }
    </style>
</head>
<body>
    <div id="map"></div>
    
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script>
        // Crear el mapa con una ubicación inicial
        var map = L.map('map').setView([51.505, -0.09], 13);

        // Agregar una capa de OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Crear el marcador en la ubicación inicial
        var marker = L.marker([51.505, -0.09]).addTo(map);

        // Función que actualiza la ubicación
        function updateLocation(position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;

            // Actualizar la posición del marcador
            marker.setLatLng([lat, lon]);

            // Centrar el mapa en la nueva ubicación
            map.setView([lat, lon], 13);
        }

        // Función para manejar errores si no se puede obtener la ubicación
        function errorHandler(error) {
            console.warn('Error al obtener la ubicación: ', error.message);
        }

        // Comenzar a rastrear la ubicación en tiempo real
        navigator.geolocation.watchPosition(updateLocation, errorHandler, {
            enableHighAccuracy: true, // Mejor precisión si está disponible
            maximumAge: 0, // No utilizar ubicación antigua
            timeout: 5000 // Tiempo máximo para obtener la posición
        });
    </script>
</body>
</html>
*/
