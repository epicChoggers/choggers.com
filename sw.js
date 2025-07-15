const cacheName = 'cr-tracker-v1';
const filesToCache = [
  './',
  './index.html',
  './js/chart.min.js',
  './js/cal-tracker.js',
  './js/hr_data.json',
  './manifest.webmanifest'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(filesToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
