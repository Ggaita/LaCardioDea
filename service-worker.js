/**
 * Módulo: service-worker.js
 * Descripción: Funciona para hacer la PWA
 * Autor: Gonzalo Gaspar Gaita + IA (ChatGPT)
 */

// Nombre de la cache para el sitio
const CACHE_NAME = 'GeoDeas';
// Archivos y recursos que se cachearán al instalar el service worker
const urlsToCache = [
  '/', // Página principal
  './styles.css', // Estilos CSS
  './app.js', // Archivo principal JS
  './js/geo.js', // Módulo de geolocalización
  './js/map.js', // Módulo de mapa
  './js/points.js', // Módulo de puntos
  './js/routing.js', // Módulo de rutas
  './icon/icon.png', // Ícono para marcadores
  './manifest.json', // Manifest para PWA
  // Dependencias externas CDN
  'https://unpkg.com/leaflet/dist/leaflet.js',
  'https://unpkg.com/leaflet/dist/leaflet.css',
  'https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.js',
  'https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.css'
];


// Evento 'install' — se activa al instalar el service worker
// Aquí se cachean todos los recursos listados en urlsToCache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento 'fetch' — intercepta solicitudes de red
// Intenta responder primero desde cache, y si no está, hace fetch normal
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

// Evento 'activate' — se activa después de instalar y cuando
// hay un service worker nuevo, elimina caches antiguos que no estén en whitelist
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Nueva lógica para manejar actualizaciones
// Escucha mensajes desde la página para forzar actualización inmediata
self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

