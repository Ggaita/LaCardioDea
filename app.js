document.addEventListener("DOMContentLoaded", function() {
    // Registro del Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(function(registration) {
                console.log('Service Worker registrado con éxito:', registration);

                // Escuchar actualizaciones
                registration.onupdatefound = () => {
                    const newWorker = registration.installing;
                    newWorker.onstatechange = () => {
                        if (newWorker.state === 'installed') {
                            if (navigator.serviceWorker.controller) {
                                // Nueva versión disponible
                                if (confirm('Hay una nueva versión disponible. ¿Quieres actualizar?')) {
                                    newWorker.postMessage({ action: 'skipWaiting' });
                                }
                            }
                        }
                    };
                };
            })
            .catch(function(error) {
                console.log('Error al registrar el Service Worker:', error);
            });
    }

    // Configuración del mapa
    const initialZoom = window.innerWidth < 768 ? 15 : 13; 
    const map = L.map('map').setView([51.505, -0.09], initialZoom);
    let userMarker; // Usuario
    let routingControl; // Control de ruta
    let userHasMovedMap = false; // Verificar si el usuario movió el mapa

    // Layer de mapa
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Traer datos de Google Apps Script
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
                const latitud = parseFloat(point.latitud) / 1000000; 
                const longitud = parseFloat(point.longitud) / 1000000; 

                if (!isNaN(latitud) && !isNaN(longitud)) {
                    const marker = L.marker([latitud, longitud], { icon: customIcon })
                        .addTo(map)
                        .bindPopup(point.nombre);

                    // Evento de clic al marcador
                    marker.on('click', () => {
                        if (routingControl) {
                            map.removeControl(routingControl);  // Elimina la ruta anterior
                        }

                        routingControl = L.Routing.control({
                            waypoints: [
                                L.latLng(userMarker.getLatLng().lat, userMarker.getLatLng().lng), // Ubicación usuario
                                L.latLng(latitud, longitud) // Ubicación punto seleccionado
                            ],
                            routeWhileDragging: true
                        }).addTo(map);
                    });
                }
            });

            if (data.length > 0) {
                map.setView([data[0].latitud / 1000000, data[0].longitud / 1000000], initialZoom);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    // Ubicación actual del dispositivo
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(position => {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;

            // Si el marcador del usuario no existe, créalo
            if (!userMarker) {
                userMarker = L.marker([userLat, userLon]).addTo(map)
                    .bindPopup('Tu ubicación')
                    .openPopup();

                // Centrar el mapa en la ubicación del usuario
                map.setView([userLat, userLon], map.getZoom());
            } else {
                // Solo actualizar la posición del marcador si se mueve
                if (!userHasMovedMap) {
                    userMarker.setLatLng([userLat, userLon]);
                }
            }
        }, () => {
            console.error("Error al obtener la ubicación.");
        });
    } else {
        console.error("Geolocalización no es soportada por este navegador.");
    }

    // Usuario mueve mapa
    map.on('moveend', () => {
        userHasMovedMap = true; // El usuario movió el mapa
    });

    // Ajustar el tamaño del mapa
    window.addEventListener('resize', () => {
        map.invalidateSize();
    });
});



