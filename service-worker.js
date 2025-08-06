const CACHE_NAME = 'GeoDeas';
const urlsToCache = [
  '/',
  './styles.css',
  './app.js',
  './geo.js',
  './map.js',
  './points.js',
  './routing.js',
  './icon.png',
  './manifest.json',
  'https://unpkg.com/leaflet/dist/leaflet.js',
  'https://unpkg.com/leaflet/dist/leaflet.css',
  'https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.js',
  'https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

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
self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

