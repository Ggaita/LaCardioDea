/* Gracias leaflet - JS y lo que ande, .......
un par de padre nuestros y ahí te voy San Pedro */

/*APP creada por Gonzalo Gaspar Gaita, full Stack RE-JUNIOR, gratuita, open source 
para ayudar a localizar los DEAs en La Pampa, sientase libre de investigar y mejorarla tambien, 
esta App es de todos ....
                                                                         Gonzalo Gaspar Gaita  */


  document.addEventListener("DOMContentLoaded", function() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(function(registration) {
                console.log('Service Worker registrado con éxito:', registration);

                registration.onupdatefound = () => {
                    const newWorker = registration.installing;
                    newWorker.onstatechange = () => {
                        if (newWorker.state === 'installed') {
                            if (navigator.serviceWorker.controller) {
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

    const initialZoom = window.innerWidth < 768 ? 15 : 13; 
    const map = L.map('map').setView([-36.82, -65.48], initialZoom);
    let userMarker;
    let routingControl;
    let userHasMovedMap = false;
    let userLocationSet = false;
    let allFeatures = []; // Guardamos todas las features GeoJSON

    const customIcon = L.icon({
        iconUrl: './icon.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });

    // Layer base
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Nueva fuente de datos GeoJSON desde WFS
    const geoJsonUrl = 'https://geoidelp.lapampa.gob.ar/geoserver/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=p_min_salud:Desfibriladores&outputFormat=application/json';

    fetch(geoJsonUrl)
        .then(response => response.json())
        .then(geojson => {
            allFeatures = geojson.features;

            geojson.features.forEach(feature => {
                const coords = feature.geometry.coordinates;
                const lat = coords[1];
                const lon = coords[0];

                const marker = L.marker([lat, lon], { icon: customIcon })
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
                    if (routingControl) {
                        map.removeControl(routingControl);
                    }

                    if (userMarker) {
                        routingControl = L.Routing.control({
                            waypoints: [
                                L.latLng(userMarker.getLatLng().lat, userMarker.getLatLng().lng),
                                L.latLng(lat, lon)
                            ],
                            routeWhileDragging: true,
                            createMarker: function() {},
                            routeLine: {
                                styles: [{ color: 'blue', weight: 4 }]
                            },
                            routeLineOptions: {
                                addWaypoints: false
                            }
                        }).addTo(map);
                    }
                });
            });

            if (geojson.features.length > 0) {
                const firstCoords = geojson.features[0].geometry.coordinates;
                map.setView([firstCoords[1], firstCoords[0]], initialZoom);
            }
        })
        .catch(error => {
            console.error('Error al cargar datos GeoJSON:', error);
        });

    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(position => {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;

            if (!userMarker) {
                userMarker = L.marker([userLat, userLon])
                    .addTo(map)
                    .bindPopup('Tu ubicación')
                    .openPopup();

                map.setView([userLat, userLon], map.getZoom());
                userLocationSet = true;
                markNearbyPoints(userLat, userLon, allFeatures);
            } else {
                if (!userHasMovedMap) {
                    userMarker.setLatLng([userLat, userLon]);
                    map.setView([userLat, userLon], map.getZoom());
                    markNearbyPoints(userLat, userLon, allFeatures);
                }
            }
        }, 
        error => {
            console.error("Error al obtener la ubicación: ", error);
        }, 
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
    } else {
        console.error("Geolocalización no es soportada por este navegador.");
    }

    function markNearbyPoints(userLat, userLon, features) {
        if (window.nearbyMarkers) {
            window.nearbyMarkers.forEach(marker => map.removeLayer(marker));
            window.nearbyMarkers = [];
        } else {
            window.nearbyMarkers = [];
        }

        const distanceThreshold = 0.01;

        const nearby = features.filter(f => {
            const coords = f.geometry.coordinates;
            const lat = coords[1];
            const lon = coords[0];
            return Math.sqrt((userLat - lat) ** 2 + (userLon - lon) ** 2) <= distanceThreshold;
        });

        nearby.forEach(f => {
            const coords = f.geometry.coordinates;
            const lat = coords[1];
            const lon = coords[0];
            const marker = L.marker([lat, lon], { icon: customIcon })
                .addTo(map)
                .bindPopup(f.properties.Institucion || 'Desfibrilador');
            window.nearbyMarkers.push(marker);
        });
    }

    map.on('moveend', () => {
        userHasMovedMap = true;
        if (userMarker) {
            markNearbyPoints(userMarker.getLatLng().lat, userMarker.getLatLng().lng, allFeatures);
        }
    });

    window.addEventListener('resize', () => {
        map.invalidateSize();
    });
});
