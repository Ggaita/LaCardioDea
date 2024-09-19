document.addEventListener("DOMContentLoaded", function() {
    const map = L.map('map').setView([51.505, -0.09], 13);
    let userMarker; // Variable para almacenar el marcador del usuario
    let routingControl; // Variable para almacenar el control de ruta

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    fetch('https://script.google.com/macros/s/AKfycbymMF4vqqu4guAWar_p14mYk1c-rq-FSN_ZWZJuHL-RZohDhvm3A4dB3WfTzwmPe74/exec')
        .then(response => response.json())
        .then(data => {
            const customIcon = L.icon({
                iconUrl: './icon.png',
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32]
            });

            data.forEach(point => {
                const latitud = parseFloat(point.latitud) / 1000000; // Conversión
                const longitud = parseFloat(point.longitud) / 1000000; // Conversión

                if (!isNaN(latitud) && !isNaN(longitud)) {
                    const marker = L.marker([latitud, longitud], { icon: customIcon })
                        .addTo(map)
                        .bindPopup(point.nombre);

                    // Agregar evento de clic en el marcador
                    marker.on('click', () => {
                        if (routingControl) {
                            map.removeControl(routingControl); // Eliminar la ruta anterior
                        }

                        routingControl = L.Routing.control({
                            waypoints: [
                                L.latLng(userMarker.getLatLng().lat, userMarker.getLatLng().lng), // Ubicación del usuario
                                L.latLng(latitud, longitud) // Ubicación del punto seleccionado
                            ],
                            routeWhileDragging: true
                        }).addTo(map);
                    });
                }
            });

            if (data.length > 0) {
                map.setView([data[0].latitud / 1000000, data[0].longitud / 1000000], 13);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    // Mostrar la ubicación actual del dispositivo
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(position => {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;

            // Si el marcador del usuario no existe, créalo
            if (!userMarker) {
                userMarker = L.marker([userLat, userLon]).addTo(map)
                    .bindPopup('Tu ubicación')
                    .openPopup();
            } else {
                // Actualizar la posición del marcador
                userMarker.setLatLng([userLat, userLon]);
            }

            // Centrar el mapa en la ubicación del usuario
            map.setView([userLat, userLon], 13);
        }, () => {
            console.error("Error al obtener la ubicación.");
        });
    } else {
        console.error("Geolocalización no es soportada por este navegador.");
    }
});



document.addEventListener("DOMContentLoaded", function() {
    // Registro del Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(function(registration) {
                console.log('Service Worker registrado con éxito:', registration);
            })
            .catch(function(error) {
                console.log('Error al registrar el Service Worker:', error);
            });
    }

    // Resto de tu código...
    const map = L.map('map').setView([51.505, -0.09], 13);
    let userMarker; // Variable para almacenar el marcador del usuario
    let routingControl; // Variable para almacenar el control de ruta

    // ... (continuar con el resto de tu código)
});




