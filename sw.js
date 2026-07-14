const CACHE_NAME = 'mutiullahi-portfolio-v1';
const APP_SHELL = [
  './',
  './index.html',
  './projects.html',
  './contact.html',
  './css/main.css',
  './css/style.css',
  './css/utilities.css',
  './js/script.js',
  './js/app.js',
  './js/particles.min.js',
  './assets/favicon/favicon.ico',
  './assets/favicon/favicon-32x32.png',
  './assets/favicon/apple-touch-icon.png',
  './assets/favicon/site.webmanifest'
];

self.addEventListener('install', function (event) {
  event.waitUntil(caches.open(CACHE_NAME).then(function (cache) {
    return cache.addAll(APP_SHELL);
  }));
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (key) {
        return key !== CACHE_NAME;
      }).map(function (key) {
        return caches.delete(key);
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  const request = event.request;

  if (request.method !== 'GET') return;

  if (request.destination === 'image' || request.destination === 'font' || request.destination === 'script' || request.destination === 'style') {
    event.respondWith(
      caches.match(request).then(function (cached) {
        if (cached) {
          return cached;
        }
        return fetch(request).then(function (response) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(request, copy);
          });
          return response;
        });
      })
    );
  }
});
